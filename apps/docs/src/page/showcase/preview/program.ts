import { framePath, isUnderOrigin } from "@/lib/preview-path";
import type { ShowcaseApp, ShowcaseClip, ShowcaseTourStep } from "../types";

/*
 * What a live preview plays, as data. No DOM, no React: the catalog, the
 * detail clip players, the docs transition demos and the tour check script
 * all read these.
 *
 * A showcase's tour (authored, or derived from its clips) resolves into
 * `PreviewStep`s that know where each move starts and lands and at which
 * history depth. A `PreviewProgram` is a loop of those steps; the runner
 * (`use-preview-tour.ts`) plays it through the page's joint-history
 * scheduler.
 */

export const DEFAULT_DWELL = { push: 1500, back: 1000, replace: 1300 } as const;
export const MAX_TOUR_DEPTH = 2;

export type MoveKind = "push" | "back" | "replace";

export type PreviewStep = {
  kind: MoveKind;
  from: string;
  to: string;
  /** Pushed entries open before this move (0 = at the tour's base). */
  depthBefore: number;
  /**
   * Effect the move plays; a back carries the effect of the push it closes.
   * "" marks a connective move of a derived tour that belongs to no effect.
   */
  transition: string;
  fromLabel: string;
  toLabel: string;
  dwell: number;
  /** Screen key (`screenKey`) of the tour step or clip this move comes from. */
  source: string;
};

export type PreviewProgramMode = "tour" | "effect" | "focus";

export type PreviewProgram = {
  /** Identity: a new key restarts the loop (after a silent unwind). */
  key: string;
  mode: PreviewProgramMode;
  /** Set in effect mode. */
  effect?: string;
  start: string;
  steps: PreviewStep[];
  /**
   * For each step, the index of the step that opened its excursion (the
   * last step at depth 0). A paused runner unwinds to depth 0 and resumes
   * there.
   */
  resume: number[];
};

export type TourIssue = {
  level: "error" | "warning";
  /** Step index, or -1 for the tour as a whole. */
  step: number;
  message: string;
};

/**
 * Where the tour starts and ends: `tourStart`, else `demoOrigin` for an
 * authored tour, else the first clip's exitPath (a derived tour then starts
 * where its first move does, and never visits an origin that redirects).
 */
export function tourStartOf(showcase: ShowcaseApp): string {
  const fallback = showcase.tour
    ? showcase.demoOrigin
    : (showcase.clips[0]?.exitPath ?? showcase.demoOrigin);
  return framePath(showcase.tourStart ?? fallback);
}

/* ------------------------------------------------------------------ labels */

function clipEnds(clip: ShowcaseClip): { from?: string; to?: string } {
  const title = clip.title.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const parts = title.split(/\s*(?:→|↔|->)\s*/);
  if (parts.length < 2) return { to: title };
  const from = parts[0]
    .split(/\s+[—–-]\s+/)
    .pop()
    ?.trim();
  return { from, to: parts[parts.length - 1].trim() };
}

function titleCase(segment: string) {
  const words = decodeURIComponent(segment).replace(/[-_]+/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : segment;
}

/** A readable name for a path nobody labeled: its last non-id segment. */
function fallbackLabel(path: string, origin: string): string {
  const p = framePath(path).replace(/[?#].*$/, "");
  const o = framePath(origin);
  const rest = (o === "/" ? p : p.slice(o.length)).split("/").filter(Boolean);
  if (!rest.length) return "Home";
  const looksLikeId = (s: string) => /\d/.test(s) && rest.length > 1;
  const seg = looksLikeId(rest[rest.length - 1])
    ? rest[rest.length - 2]
    : rest[rest.length - 1];
  return titleCase(seg);
}

/** Screen names by path: tour labels, then clip titles, then the path. */
export function screenLabels(showcase: ShowcaseApp) {
  const labels = new Map<string, string>();
  const set = (path: string, label?: string) => {
    const key = framePath(path);
    if (label && !labels.has(key)) labels.set(key, label);
  };
  if (showcase.tourStartLabel)
    set(tourStartOf(showcase), showcase.tourStartLabel);
  set(showcase.demoOrigin, "Home");
  for (const step of showcase.tour ?? []) {
    if ("push" in step) set(step.push, step.label);
    else if ("replace" in step) set(step.replace, step.label);
  }
  for (const clip of showcase.clips) {
    const { from, to } = clipEnds(clip);
    set(clip.enterPath, to);
    set(clip.exitPath, from);
  }
  return (path: string) =>
    labels.get(framePath(path)) ?? fallbackLabel(path, showcase.demoOrigin);
}

/* ------------------------------------------------------------------ tours */

/** Default tour for a showcase without one: each clip as push + back. */
export function deriveTour(showcase: ShowcaseApp): ShowcaseTourStep[] {
  const start = tourStartOf(showcase);
  let at = start;
  const steps: ShowcaseTourStep[] = [];
  for (const clip of showcase.clips) {
    const exit = framePath(clip.exitPath);
    const enter = framePath(clip.enterPath);
    if (exit !== at) steps.push({ replace: exit, transition: "" });
    steps.push({ push: enter, transition: clip.transition });
    steps.push({ back: true });
    at = exit;
  }
  if (at !== start) steps.push({ replace: start, transition: "" });
  return steps;
}

type Analysis = { steps: PreviewStep[]; issues: TourIssue[] };

function analyze(
  showcase: ShowcaseApp,
  tour: readonly ShowcaseTourStep[],
  sourceOf: (index: number) => string,
): Analysis {
  const label = screenLabels(showcase);
  const start = tourStartOf(showcase);
  const issues: TourIssue[] = [];
  const steps: PreviewStep[] = [];
  const open: { from: string; transition: string }[] = [];
  let at = start;
  const origin = showcase.demoOrigin;

  if (!isUnderOrigin(start, origin))
    issues.push({
      level: "error",
      step: -1,
      message: `tourStart ${start} is not under demoOrigin ${origin}`,
    });
  if (!tour.length)
    issues.push({ level: "error", step: -1, message: "tour is empty" });

  tour.forEach((raw, i) => {
    const err = (message: string) =>
      issues.push({ level: "error", step: i, message });
    const depthBefore = open.length;
    if (raw.dwell !== undefined && !(raw.dwell >= 0 && isFinite(raw.dwell)))
      err(`dwell must be a non-negative number (got ${raw.dwell})`);

    if ("back" in raw) {
      const top = open.pop();
      if (!top) {
        err("back at depth 0 — nothing to return to (it would leave the page)");
        return;
      }
      steps.push({
        kind: "back",
        from: at,
        to: top.from,
        depthBefore,
        transition: top.transition,
        fromLabel: label(at),
        toLabel: label(top.from),
        dwell: raw.dwell ?? DEFAULT_DWELL.back,
        source: sourceOf(i),
      });
      at = top.from;
      return;
    }

    const kind: MoveKind = "push" in raw ? "push" : "replace";
    const to = framePath("push" in raw ? raw.push : raw.replace);
    if (!isUnderOrigin(to, origin))
      err(`${to} is not under demoOrigin ${origin}`);
    if (to === at)
      err(`${kind} to ${to}, the screen it is already on (nothing would move)`);
    if (raw.transition === undefined) err(`${kind} needs a transition name`);
    else if (raw.transition && !showcase.transitions.includes(raw.transition))
      issues.push({
        level: "warning",
        step: i,
        message: `transition "${raw.transition}" is missing from showcase.transitions`,
      });
    steps.push({
      kind,
      from: at,
      to,
      depthBefore,
      transition: raw.transition ?? "",
      fromLabel: label(at),
      toLabel: raw.label ?? label(to),
      dwell: raw.dwell ?? DEFAULT_DWELL[kind],
      source: sourceOf(i),
    });
    if (kind === "push") {
      open.push({ from: at, transition: raw.transition ?? "" });
      if (open.length > MAX_TOUR_DEPTH)
        err(`depth ${open.length} exceeds the maximum of ${MAX_TOUR_DEPTH}`);
    }
    at = to;
  });

  if (open.length)
    issues.push({
      level: "error",
      step: -1,
      message: `${open.length} push${open.length > 1 ? "es are" : " is"} never closed by a back`,
    });
  if (at !== start)
    issues.push({
      level: "error",
      step: -1,
      message: `tour ends on ${at}, not on tourStart ${start} — the loop would cut`,
    });
  return { steps, issues };
}

/** Problems with a showcase's authored tour (empty when it has none). */
export function validateTour(showcase: ShowcaseApp): TourIssue[] {
  if (!showcase.tour) return [];
  const { issues } = analyze(showcase, showcase.tour, (i) => `t:${i}`);
  const known = new Set(showcase.transitions);
  for (const clip of showcase.clips)
    if (!known.has(clip.transition))
      issues.push({
        level: "warning",
        step: -1,
        message: `clip "${clip.title}" plays "${clip.transition}", missing from showcase.transitions`,
      });
  return issues;
}

function withResume(
  key: string,
  mode: PreviewProgramMode,
  start: string,
  steps: PreviewStep[],
  effect?: string,
): PreviewProgram {
  const resume: number[] = [];
  let last = 0;
  steps.forEach((step, i) => {
    if (step.depthBefore === 0) last = i;
    resume.push(last);
  });
  return { key, mode, effect, start, steps, resume };
}

/**
 * The resolved tour steps: the authored tour when it is valid, otherwise
 * the tour derived from clips.
 */
export function resolveTour(showcase: ShowcaseApp): {
  steps: PreviewStep[];
  authored: boolean;
} {
  if (showcase.tour) {
    const a = analyze(showcase, showcase.tour, (i) => `t:${i}`);
    if (!a.issues.some((x) => x.level === "error"))
      return { steps: a.steps, authored: true };
  }
  const derived = deriveTour(showcase);
  // Derived steps point at their clip: push/back pairs follow clip order.
  const sources: string[] = [];
  let clip = -1;
  for (const step of derived) {
    if ("push" in step) clip += 1;
    sources.push("replace" in step && !step.transition ? "" : `c:${clip}`);
  }
  return {
    steps: analyze(showcase, derived, (i) => sources[i]).steps,
    authored: false,
  };
}

export function tourProgram(showcase: ShowcaseApp): PreviewProgram {
  return withResume(
    "tour",
    "tour",
    tourStartOf(showcase),
    resolveTour(showcase).steps,
  );
}

/* ------------------------------------------------------ effect and focus */

/** A there-and-back move: `go` from `origin`, then return to it. */
export type PreviewItem = {
  key: string;
  kind: "push" | "replace";
  origin: string;
  to: string;
  transition: string;
  originLabel: string;
  toLabel: string;
  dwell: number;
};

function itemFromStep(step: PreviewStep): PreviewItem {
  return {
    key: step.source,
    kind: step.kind === "replace" ? "replace" : "push",
    origin: step.from,
    to: step.to,
    transition: step.transition,
    originLabel: step.fromLabel,
    toLabel: step.toLabel,
    dwell: step.dwell,
  };
}

function itemFromClip(
  showcase: ShowcaseApp,
  clip: ShowcaseClip,
  index: number,
): PreviewItem {
  const label = screenLabels(showcase);
  return {
    key: `c:${index}`,
    kind: "push",
    origin: framePath(clip.exitPath),
    to: framePath(clip.enterPath),
    transition: clip.transition,
    originLabel: label(clip.exitPath),
    toLabel: label(clip.enterPath),
    dwell: DEFAULT_DWELL.push,
  };
}

/**
 * Everything a showcase does with one effect, as there-and-back items:
 * tour pushes (return = back), tour replaces (return = replace to where it
 * came from, which `ordered` plays backward), then clips the tour does not
 * already cover (exitPath, push enterPath, back).
 */
export function effectItems(
  showcase: ShowcaseApp,
  effect: string,
): PreviewItem[] {
  const items: PreviewItem[] = [];
  const seen = new Set<string>();
  const add = (item: PreviewItem) => {
    const id = `${item.origin} ${item.to}`;
    if (seen.has(id) || item.origin === item.to) return;
    seen.add(id);
    items.push(item);
  };
  for (const step of resolveTour(showcase).steps)
    if (step.kind !== "back" && step.transition === effect)
      add(itemFromStep(step));
  showcase.clips.forEach((clip, i) => {
    if (clip.transition !== effect) return;
    const item = itemFromClip(showcase, clip, i);
    // A tour replace between the same two screens covers the clip too.
    if (seen.has(`${item.to} ${item.origin}`)) return;
    add(item);
  });
  return items;
}

/**
 * Plays items as there-and-back moves. An item that starts where the open
 * one landed nests inside it (A→B, B→C, C→B, B→A) instead of returning
 * first, so a chain of tabs or a push inside a push loops without cuts;
 * otherwise open items close before the next one starts (the runner then
 * silently repositions to its origin).
 */
function chainSteps(items: PreviewItem[]): PreviewStep[] {
  const steps: PreviewStep[] = [];
  const open: PreviewItem[] = [];
  let at: string | null = null;
  let depth = 0;
  const go = (item: PreviewItem) => {
    steps.push({
      kind: item.kind,
      from: item.origin,
      to: item.to,
      depthBefore: depth,
      transition: item.transition,
      fromLabel: item.originLabel,
      toLabel: item.toLabel,
      dwell: item.dwell,
      source: item.key,
    });
    if (item.kind === "push") depth += 1;
    at = item.to;
    open.push(item);
  };
  const close = () => {
    const item = open.pop()!;
    if (item.kind === "push") depth -= 1;
    steps.push({
      kind: item.kind === "push" ? "back" : "replace",
      from: item.to,
      to: item.origin,
      depthBefore: item.kind === "push" ? depth + 1 : depth,
      transition: item.transition,
      fromLabel: item.toLabel,
      toLabel: item.originLabel,
      dwell: item.kind === "push" ? DEFAULT_DWELL.back : DEFAULT_DWELL.replace,
      source: item.key,
    });
    at = item.origin;
  };
  for (const item of items) {
    const nests =
      open.length > 0 &&
      at === item.origin &&
      (item.kind !== "push" || depth < MAX_TOUR_DEPTH);
    if (!nests) while (open.length) close();
    go(item);
  }
  while (open.length) close();
  return steps;
}

function itemsProgram(
  key: string,
  mode: PreviewProgramMode,
  items: PreviewItem[],
  effect?: string,
): PreviewProgram | null {
  if (!items.length) return null;
  return withResume(key, mode, items[0].origin, chainSteps(items), effect);
}

/** Loop of only the moves that play `effect`, each forward and back. */
export function effectProgram(
  showcase: ShowcaseApp,
  effect: string,
): PreviewProgram | null {
  return itemsProgram(
    `effect:${effect}`,
    "effect",
    effectItems(showcase, effect),
    effect,
  );
}

/* ---------------------------------------------------------------- screens */

/** A named move of a showcase that search can point at. */
export type PreviewScreen = PreviewItem & {
  /** "Watch", "Photo tour" — what people search for. */
  label: string;
  /** Clip titles and labels that describe the same move. */
  aliases: string[];
};

/**
 * Searchable screens: labeled tour moves (push/replace), then clips whose
 * move the tour does not make. Keys are `t:<step>` / `c:<clip>`.
 */
export function showcaseScreens(showcase: ShowcaseApp): PreviewScreen[] {
  const out: PreviewScreen[] = [];
  const byPair = new Map<string, PreviewScreen>();
  const { steps, authored } = resolveTour(showcase);
  if (authored)
    for (const step of steps) {
      if (step.kind === "back" || !step.transition) continue;
      const pair = `${step.from} ${step.to}`;
      if (byPair.has(pair)) continue;
      const screen: PreviewScreen = {
        ...itemFromStep(step),
        label: step.toLabel,
        aliases: [],
      };
      byPair.set(pair, screen);
      out.push(screen);
    }
  showcase.clips.forEach((clip, i) => {
    const item = itemFromClip(showcase, clip, i);
    const pair = `${item.origin} ${item.to}`;
    const covered = byPair.get(pair) ?? byPair.get(`${item.to} ${item.origin}`);
    if (covered) {
      covered.aliases.push(clip.title);
      return;
    }
    const screen: PreviewScreen = { ...item, label: clip.title, aliases: [] };
    byPair.set(pair, screen);
    out.push(screen);
  });
  return out;
}

/** Loop of one screen's move, forward and back. */
export function focusProgram(
  showcase: ShowcaseApp,
  screenKey: string,
): PreviewProgram | null {
  const screen = showcaseScreens(showcase).find((s) => s.key === screenKey);
  return screen ? itemsProgram(`focus:${screenKey}`, "focus", [screen]) : null;
}

/** Transitions a showcase plays anywhere: tour, clips, declared list. */
export function showcaseEffects(showcase: ShowcaseApp): string[] {
  const out = new Set(showcase.transitions);
  for (const step of resolveTour(showcase).steps)
    if (step.transition) out.add(step.transition);
  for (const clip of showcase.clips) out.add(clip.transition);
  return [...out];
}

/** First clip index playing `effect` (detail page anchor), or -1. */
export function clipIndexFor(showcase: ShowcaseApp, effect: string): number {
  return showcase.clips.findIndex((c) => c.transition === effect);
}

/** A card-sized caption: "Home → Watch". */
export function stepCaption(step: PreviewStep): string {
  return `${step.fromLabel} → ${step.toLabel}`;
}

/**
 * A single there-and-back loop between two routes (detail clip players,
 * docs transition demos): push `to`, dwell, back, dwell.
 */
export function pairProgram({
  from,
  to,
  transition = "",
  fromLabel = "",
  toLabel = "",
  dwell,
}: {
  from: string;
  to: string;
  transition?: string;
  fromLabel?: string;
  toLabel?: string;
  /** Hold on each end, in ms. */
  dwell?: number;
}): PreviewProgram {
  const origin = framePath(from);
  const target = framePath(to);
  const program = itemsProgram(`pair:${origin} ${target}`, "focus", [
    {
      key: "pair",
      kind: "push",
      origin,
      to: target,
      transition,
      originLabel: fromLabel,
      toLabel,
      dwell: dwell ?? DEFAULT_DWELL.push,
    },
  ])!;
  if (dwell !== undefined) program.steps[1].dwell = dwell;
  return program;
}

/** A detail-page clip as a loop; `intervalMs` is the hold on each end. */
export function clipProgram(clip: ShowcaseClip): PreviewProgram {
  const { from, to } = clipEnds(clip);
  return pairProgram({
    from: clip.exitPath,
    to: clip.enterPath,
    transition: clip.transition,
    fromLabel: from,
    toLabel: to,
    dwell: clip.intervalMs,
  });
}
