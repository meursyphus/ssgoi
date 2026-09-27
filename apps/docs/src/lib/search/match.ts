import { TRANSITION_TERMS } from "./aliases";
import type { SearchDoc, SearchGroup } from "./types";

/*
 * One matcher for the catalog filter and the ⌘K palette.
 *
 * Text is lower-cased and Hangul is split into compatibility jamo (compound
 * finals and vowels too), so a query typed mid-composition — "당ㄱ", "카토" —
 * is a plain prefix of the finished word. Every query token has to hit some
 * field; the document's score is the sum of each token's best hit × the
 * field's weight, times a small prior per kind of result.
 */

const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const JONG = ["", ..."ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"];
const SPLIT: Record<string, string> = {
  ㄳ: "ㄱㅅ",
  ㄵ: "ㄴㅈ",
  ㄶ: "ㄴㅎ",
  ㄺ: "ㄹㄱ",
  ㄻ: "ㄹㅁ",
  ㄼ: "ㄹㅂ",
  ㄽ: "ㄹㅅ",
  ㄾ: "ㄹㅌ",
  ㄿ: "ㄹㅍ",
  ㅀ: "ㄹㅎ",
  ㅄ: "ㅂㅅ",
  ㅘ: "ㅗㅏ",
  ㅙ: "ㅗㅐ",
  ㅚ: "ㅗㅣ",
  ㅝ: "ㅜㅓ",
  ㅞ: "ㅜㅔ",
  ㅟ: "ㅜㅣ",
  ㅢ: "ㅡㅣ",
};
const COMPOUND = /[ㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄㅘㅙㅚㅝㅞㅟㅢ]/g;
const SYLLABLE = /[가-힣]/g;
const ONLY_CONSONANTS = /^[ㄱ-ㅎ]{2,}$/;
const NON_WORD = /[^\p{L}\p{N}]+/gu;

function syllableIndex(c: string) {
  return c.charCodeAt(0) - 0xac00;
}

function toJamo(value: string) {
  return value
    .replace(SYLLABLE, (c) => {
      const i = syllableIndex(c);
      return CHO[(i / 588) | 0] + JUNG[((i % 588) / 28) | 0] + JONG[i % 28];
    })
    .replace(COMPOUND, (c) => SPLIT[c]);
}

/** NFC (not NFKC: that turns a typed ㄱ into a conjoining jamo), lower case, jamo. */
export function normalize(value: string): string {
  return toJamo(value.normalize("NFC").toLowerCase())
    .replace(NON_WORD, " ")
    .trim();
}

/** Initial consonants of each Hangul word: "유튜브 뮤직" → ["ㅇㅌㅂ", "ㅁㅈ"]. */
function initials(value: string): string[] | undefined {
  const out: string[] = [];
  for (const word of value.normalize("NFC").split(NON_WORD)) {
    const syllables = word.match(SYLLABLE);
    if (syllables)
      out.push(
        syllables.map((c) => CHO[(syllableIndex(c) / 588) | 0]).join(""),
      );
  }
  return out.length ? out : undefined;
}

/** restore → restor (restoration), matching → match. Keeps at least 4 chars. */
function stem(token: string): string | null {
  const s = token.replace(/(ations?|ing|ed|es|e|s)$/, "");
  return s.length >= 4 && s !== token ? s : null;
}

function levenshtein(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      best = Math.min(best, cur[j]);
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

type Field = {
  /** normalized text without spaces */
  c: string;
  words: string[];
  weight: number;
  /** compact query equal to this field earns the exact-name bonus */
  exact: boolean;
  /** tolerate one or two typos (titles and aliases only) */
  fuzzy: boolean;
  ini?: string[];
  iniCompact?: string;
};

const W = {
  title: 10,
  alias: 9,
  synonym: 7,
  transition: 6,
  clip: 5,
  parent: 3,
  terms: 3,
  text: 2,
} as const;

const EXACT_BONUS = 8;

function makeField(
  text: string | undefined,
  weight: number,
  opts: { exact?: boolean; fuzzy?: boolean } = {},
): Field | null {
  if (!text) return null;
  const n = normalize(text);
  if (!n) return null;
  const ini = initials(text);
  return {
    c: n.replace(/ /g, ""),
    words: n.split(" "),
    weight,
    exact: Boolean(opts.exact),
    fuzzy: Boolean(opts.fuzzy),
    ini,
    iniCompact: ini?.join(""),
  };
}

function tokenHit(token: string, f: Field): number {
  let hit = 0;
  for (const w of f.words) {
    if (w === token) return 1;
    if (!hit && w.startsWith(token)) hit = 0.8;
  }
  if (hit) return hit;
  if (f.c.startsWith(token)) return 0.7;
  if (f.ini && ONLY_CONSONANTS.test(token)) {
    for (const i of f.ini) if (i.startsWith(token)) return 0.7;
    if (f.iniCompact?.startsWith(token)) return 0.6;
  }
  const s = stem(token);
  if (s) for (const w of f.words) if (w.startsWith(s)) return 0.6;
  if (token.length >= 2 && f.c.includes(token)) return 0.45;
  if (f.fuzzy && token.length >= 5) {
    const max = token.length >= 8 ? 2 : 1;
    for (const w of f.words) if (levenshtein(token, w, max) <= max) return 0.35;
  }
  return 0;
}

function bestHit(token: string, fields: readonly Field[]): number {
  let best = 0;
  for (const f of fields) {
    const s = tokenHit(token, f) * f.weight;
    if (s > best) best = s;
  }
  return best;
}

export type ParsedQuery = { full: string; tokens: string[] };

export function parseQuery(query: string): ParsedQuery {
  const n = normalize(query);
  return { full: n.replace(/ /g, ""), tokens: n ? n.split(" ") : [] };
}

function scoreFields(fields: readonly Field[], q: ParsedQuery): number | null {
  let total = 0;
  for (const token of q.tokens) {
    const best = bestHit(token, fields);
    if (!best) return null;
    total += best;
  }
  if (fields.some((f) => f.exact && f.c === q.full)) total += EXACT_BONUS;
  return total;
}

export type PreparedDoc = {
  doc: SearchDoc;
  order: number;
  prior: number;
  fields: Field[];
  /** title + aliases: what names the demo, shared by every clip */
  ident: Field[];
  clips: Field[][];
};

function priorOf(doc: SearchDoc): number {
  if (doc.kind === "demo") return 1;
  if (doc.kind === "section") return doc.group === "blog" ? 0.8 : 0.9;
  if (doc.group === "transitions") return 1.3;
  if (doc.group === "blog") return 0.85;
  return 1.15;
}

function compact<T>(items: (T | null)[]): T[] {
  return items.filter((x): x is T => x !== null);
}

function termsOf(transition: string) {
  return TRANSITION_TERMS[transition]?.join(" | ");
}

export function prepareDoc(doc: SearchDoc, order = 0): PreparedDoc {
  const title = makeField(doc.title, W.title, { exact: true, fuzzy: true });
  const aliases = compact(
    (doc.aliases ?? []).map((a) =>
      makeField(a, W.alias, { exact: true, fuzzy: true }),
    ),
  );
  const fields = compact([
    title,
    ...aliases,
    ...(doc.synonyms ?? []).map((s) =>
      makeField(s, W.synonym, { exact: true }),
    ),
    ...(doc.transitions ?? []).flatMap((t) => [
      makeField(t, W.transition, { exact: true }),
      makeField(termsOf(t), W.terms),
    ]),
    makeField(doc.parent, W.parent),
    makeField(doc.text, W.text),
    makeField(doc.terms, W.terms),
  ]);
  const clips = (doc.clips ?? []).map((clip) =>
    compact([
      makeField(clip.title, W.clip),
      makeField(clip.transition, W.transition, { exact: true }),
      makeField(termsOf(clip.transition), W.terms),
    ]),
  );
  return {
    doc,
    order,
    prior: priorOf(doc),
    fields,
    ident: compact([title, ...aliases]),
    clips,
  };
}

export type SearchMatch = {
  doc: SearchDoc;
  score: number;
  /** index of the clip the query is about, or -1 */
  clip: number;
  order: number;
};

export function scoreDoc(p: PreparedDoc, q: ParsedQuery): SearchMatch | null {
  if (!q.tokens.length) return null;
  const base = scoreFields(p.fields, q) ?? 0;
  let clip = -1;
  let clipScore = 0;
  p.clips.forEach((own, i) => {
    const s = scoreFields([...own, ...p.ident], q);
    if (s === null || s <= clipScore) return;
    // Report a clip only when it, not the demo's name, answers some token.
    const answers = q.tokens.some((token) => {
      const mine = bestHit(token, own);
      return mine > 0 && mine >= bestHit(token, p.ident);
    });
    if (answers) {
      clip = i;
      clipScore = s;
    }
  });
  const score = Math.max(base, clipScore);
  if (!score) return null;
  return { doc: p.doc, score: score * p.prior, clip, order: p.order };
}

/** All matches, best first; ties keep source order (nav and catalog order). */
export function rank(
  prepared: readonly PreparedDoc[],
  query: string | ParsedQuery,
): SearchMatch[] {
  const q = typeof query === "string" ? parseQuery(query) : query;
  if (!q.tokens.length) return [];
  const out: SearchMatch[] = [];
  for (const p of prepared) {
    const m = scoreDoc(p, q);
    if (m) out.push(m);
  }
  return out.sort((a, b) => b.score - a.score || a.order - b.order);
}

export const GROUP_LABELS: Record<SearchGroup, string> = {
  docs: "Docs",
  transitions: "Transitions",
  frameworks: "Frameworks",
  demos: "Demos",
  blog: "Blog",
};

export type SearchResultGroup = {
  group: SearchGroup;
  label: string;
  items: SearchMatch[];
};

/**
 * Groups ordered by their best hit; at most `perGroup` rows each (`solo` when
 * only one group has results) and `total` rows overall.
 */
export function groupMatches(
  matches: readonly SearchMatch[],
  { perGroup = 5, solo = 8, total = 30 } = {},
): SearchResultGroup[] {
  const byGroup = new Map<SearchGroup, SearchMatch[]>();
  for (const m of matches) {
    const list = byGroup.get(m.doc.group);
    if (list) list.push(m);
    else byGroup.set(m.doc.group, [m]);
  }
  const limit = byGroup.size === 1 ? solo : perGroup;
  let left = total;
  const out: SearchResultGroup[] = [];
  for (const [group, items] of byGroup) {
    if (left <= 0) break;
    const take = items.slice(0, Math.min(limit, left));
    left -= take.length;
    out.push({ group, label: GROUP_LABELS[group], items: take });
  }
  return out;
}

/** Link for a match: a demo whose clip matched opens at that clip. */
export function matchHref(m: SearchMatch): string {
  return m.clip >= 0 ? `${m.doc.href}#clip-${m.clip}` : m.doc.href;
}
