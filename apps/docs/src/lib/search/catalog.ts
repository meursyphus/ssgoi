import {
  showcases,
  type ShowcaseApp,
  type ShowcasePlatform,
} from "@/page/showcase/data";
import {
  clipIndexFor,
  showcaseEffects,
  showcaseScreens,
  type PreviewScreen,
} from "@/page/showcase/preview/program";
import { DEMO_ALIASES, TRANSITION_TERMS, showcaseToDoc } from "./aliases";
import {
  parseQuery,
  prepareDoc,
  scoreDoc,
  type ParsedQuery,
  type PreparedDoc,
} from "./match";

/*
 * The landing catalog's search: which demos a query shows, and what each
 * card's live preview loops while it does.
 *
 * A query is read as effect terms plus the rest. Effect terms are preset
 * names and what people call them (`TRANSITION_TERMS`: "bottom sheet",
 * "shared element", "expand"); the rest is matched against app names, aliases,
 * taglines and screen names with the palette's matcher. "youtube zoom" =
 * demos that play zoom AND match "youtube". When a card is left with exactly
 * one effect, it loops only that effect's moves (effect mode).
 */

export type CatalogApp = {
  showcase: ShowcaseApp;
  order: number;
  effects: string[];
  screens: PreviewScreen[];
  /** Detail-page clip index per screen, or -1. */
  screenClips: number[];
  /** Name + aliases + tagline + screens (screen i = doc clip i). */
  doc: PreparedDoc;
};

export const CATALOG: CatalogApp[] = showcases.map((showcase, order) => {
  const screens = showcaseScreens(showcase);
  const titles = showcase.clips.map((c) => c.title);
  const screenClips = screens.map((screen) => {
    if (screen.key.startsWith("c:")) return Number(screen.key.slice(2));
    const covered = screen.aliases.find((a) => titles.includes(a));
    if (covered) return titles.indexOf(covered);
    const i = showcase.clips.findIndex(
      (c) => c.enterPath === screen.to && c.transition === screen.transition,
    );
    return i;
  });
  const base = showcaseToDoc(showcase);
  const doc = prepareDoc(
    {
      ...base,
      transitions: showcaseEffects(showcase),
      clips: screens.map((s) => ({
        title: [s.label, ...s.aliases].join(" · "),
        transition: s.transition,
      })),
    },
    order,
  );
  return {
    showcase,
    order,
    effects: showcaseEffects(showcase),
    screens,
    screenClips,
    doc,
  };
});

const BY_SLUG = new Map(CATALOG.map((a) => [a.showcase.slug, a]));

export function catalogApp(slug: string): CatalogApp | undefined {
  return BY_SLUG.get(slug);
}

/** Every effect a demo plays, preset list order first. */
export const CATALOG_EFFECTS: string[] = (() => {
  const played = new Set(CATALOG.flatMap((a) => a.effects));
  const ordered = Object.keys(TRANSITION_TERMS).filter((t) => played.has(t));
  for (const t of played) if (!ordered.includes(t)) ordered.push(t);
  return ordered;
})();

/* ----------------------------------------------------------- effect terms */

type EffectTerm = { effect: string; compact: string; tokens: number };

const EFFECT_TERMS: EffectTerm[] = CATALOG_EFFECTS.flatMap((effect) =>
  [effect, ...(TRANSITION_TERMS[effect] ?? [])].flatMap((term) => {
    const q = parseQuery(term);
    return q.tokens.length
      ? [{ effect, compact: q.full, tokens: q.tokens.length }]
      : [];
  }),
);

export type EffectQuery = {
  /** One group per effect term found; a term can name several effects ("tab"). */
  groups: string[][];
  /** Query tokens that are not effect terms. */
  rest: ParsedQuery;
};

/**
 * Splits effect terms out of a query. Terms match whole tokens, also across
 * a space the user typed or left out ("bottom sheet", "bottomsheet").
 * The longest term at each position wins.
 */
export function parseEffectQuery(query: string): EffectQuery {
  const { tokens } = parseQuery(query);
  const groups: string[][] = [];
  const rest: string[] = [];
  let i = 0;
  while (i < tokens.length) {
    let taken = 0;
    for (let n = Math.min(3, tokens.length - i); n >= 1 && !taken; n--) {
      const joined = tokens.slice(i, i + n).join("");
      const effects = [
        ...new Set(
          EFFECT_TERMS.filter((t) => t.compact === joined).map((t) => t.effect),
        ),
      ];
      if (effects.length) {
        groups.push(effects);
        taken = n;
      }
    }
    if (taken) i += taken;
    else rest.push(tokens[i++]);
  }
  return { groups, rest: { tokens: rest, full: rest.join("") } };
}

/** The single effect a query names, if it names exactly one. */
export function queryEffect(query: string): string | null {
  const { groups } = parseEffectQuery(query);
  const all = new Set(groups.flat());
  return all.size === 1 ? [...all][0] : null;
}

/* ---------------------------------------------------------------- filter */

export type CatalogFilter = {
  text: string;
  /** Effect pill. */
  effect?: string;
  /** App pill (slug). */
  app?: string;
  /** Screen pill: a screen key of the `app`. */
  screen?: string;
};

export type CardPlan =
  | { mode: "tour" }
  | { mode: "effect"; effect: string }
  | { mode: "focus"; screen: string };

export type CatalogHit = {
  app: CatalogApp;
  rank: number;
  plan: CardPlan;
  /** Detail page clip anchor for the card link, or -1. */
  clip: number;
  /** Screen a text query landed on, or -1. */
  screen: number;
};

export type CatalogSearch = {
  /** False when nothing filters the catalog. */
  active: boolean;
  /** Effects the filter resolves to (pill and typed terms). */
  effects: string[];
  /** The effect when there is exactly one. */
  effect: string | null;
  hits: Map<string, CatalogHit>;
};

export function isFilterEmpty(f: CatalogFilter) {
  return !f.text.trim() && !f.effect && !f.app;
}

export function searchCatalog(filter: CatalogFilter): CatalogSearch {
  const { groups: typed, rest } = parseEffectQuery(filter.text);
  const groups = filter.effect ? [[filter.effect], ...typed] : typed;
  const all = [...new Set(groups.flat())];
  const hits = new Map<string, CatalogHit>();
  const scored: { app: CatalogApp; score: number; screen: number }[] = [];

  for (const app of CATALOG) {
    const { slug } = app.showcase;
    if (filter.app && slug !== filter.app) continue;
    if (!groups.every((g) => g.some((e) => app.effects.includes(e)))) continue;
    let score = 0;
    let screen = -1;
    if (rest.tokens.length) {
      const m = scoreDoc(app.doc, rest);
      if (!m) continue;
      score = m.score;
      screen = m.clip;
    }
    scored.push({ app, score, screen });
  }
  scored.sort((a, b) => b.score - a.score || a.app.order - b.app.order);

  scored.forEach(({ app, screen }, rank) => {
    const { showcase } = app;
    const own = all.filter((e) => app.effects.includes(e));
    let plan: CardPlan = { mode: "tour" };
    let clip = -1;
    const pinned =
      filter.screen && filter.app === showcase.slug
        ? app.screens.findIndex((s) => s.key === filter.screen)
        : -1;
    if (pinned >= 0) {
      plan = { mode: "focus", screen: app.screens[pinned].key };
      clip = app.screenClips[pinned];
    } else if (groups.length && own.length === 1) {
      plan = { mode: "effect", effect: own[0] };
      clip = clipIndexFor(showcase, own[0]);
    } else if (!groups.length && screen >= 0) {
      plan = { mode: "focus", screen: app.screens[screen].key };
      clip = app.screenClips[screen];
    }
    hits.set(showcase.slug, { app, rank, plan, clip, screen });
  });

  return {
    active: !isFilterEmpty(filter),
    effects: all,
    effect: all.length === 1 ? all[0] : null,
    hits,
  };
}

export function onPlatform(app: CatalogApp, platform: ShowcasePlatform) {
  return app.showcase.platforms.includes(platform);
}

/* ------------------------------------------------------------ suggestions */

export type EffectSuggestion = {
  kind: "effect";
  effect: string;
  synonyms: string[];
  /** Demos playing it on the current platform / on any platform. */
  here: number;
  total: number;
};

export type AppSuggestion = {
  kind: "app";
  app: CatalogApp;
  platform: ShowcasePlatform;
};

export type ScreenSuggestion = {
  kind: "screen";
  app: CatalogApp;
  screen: PreviewScreen;
};

export type Suggestion = EffectSuggestion | AppSuggestion | ScreenSuggestion;

export type SuggestionGroups = {
  effects: EffectSuggestion[];
  apps: AppSuggestion[];
  screens: ScreenSuggestion[];
};

const EFFECT_DOCS = CATALOG_EFFECTS.map((effect, i) =>
  prepareDoc(
    {
      group: "transitions",
      kind: "page",
      title: effect,
      href: `#${effect}`,
      synonyms: TRANSITION_TERMS[effect],
    },
    i,
  ),
);

const APP_DOCS = CATALOG.map((app) =>
  prepareDoc(
    {
      group: "demos",
      kind: "demo",
      title: app.showcase.name,
      href: app.showcase.slug,
      aliases: DEMO_ALIASES[app.showcase.slug],
      terms: app.showcase.slug.replace(/-/g, " "),
    },
    app.order,
  ),
);

const SCREEN_ITEMS = CATALOG.flatMap((app) =>
  app.screens.map((screen) => ({
    app,
    screen,
    doc: prepareDoc(
      {
        group: "demos",
        kind: "section",
        title: screen.label,
        href: `${app.showcase.slug}/${screen.key}`,
        aliases: screen.aliases,
        text: `${screen.originLabel} ${screen.toLabel}`,
      },
      app.order,
    ),
  })),
);

function countEffect(effect: string, platform?: ShowcasePlatform) {
  return CATALOG.filter(
    (a) => a.effects.includes(effect) && (!platform || onPlatform(a, platform)),
  ).length;
}

function parsed(tokens: string[]): ParsedQuery {
  return { tokens, full: tokens.join("") };
}

/** Rows whose doc matches `q`, best first, current platform first on ties. */
function matching<T>(
  items: readonly T[],
  docOf: (item: T) => PreparedDoc,
  appOf: (item: T) => CatalogApp | null,
  q: ParsedQuery,
  platform: ShowcasePlatform,
): T[] {
  const here = (item: T) => {
    const app = appOf(item);
    return app ? Number(onPlatform(app, platform)) : 0;
  };
  return items
    .map((item, i) => ({ item, i, m: scoreDoc(docOf(item), q) }))
    .filter((x) => x.m)
    .sort(
      (a, b) =>
        b.m!.score - a.m!.score || here(b.item) - here(a.item) || a.i - b.i,
    )
    .map((x) => x.item);
}

/**
 * Autocomplete rows for the catalog field. Multi-word queries are read the
 * way they are typed: "youtube zo" suggests effects for the word being
 * typed ("zo" → zoom), apps for the words before it, and that app's screens
 * for the last word.
 */
export function suggest(
  filter: CatalogFilter,
  platform: ShowcasePlatform,
): SuggestionGroups {
  const q = parseQuery(filter.text);
  const typing = q.tokens.length > 0;
  const last = typing ? parsed(q.tokens.slice(-1)) : null;
  const head = q.tokens.length > 1 ? parsed(q.tokens.slice(0, -1)) : null;
  const effectOf = (effect: string): EffectSuggestion => ({
    kind: "effect",
    effect,
    synonyms: (TRANSITION_TERMS[effect] ?? []).slice(0, 3),
    here: countEffect(effect, platform),
    total: countEffect(effect),
  });
  const withEffect = (app: CatalogApp) =>
    !filter.effect || app.effects.includes(filter.effect);

  let effects: EffectSuggestion[] = [];
  if (!filter.effect) {
    const names = typing
      ? (() => {
          const byName = (query: ParsedQuery) =>
            matching(
              CATALOG_EFFECTS,
              (e) => EFFECT_DOCS[CATALOG_EFFECTS.indexOf(e)],
              () => null,
              query,
              platform,
            );
          const full = byName(q);
          return full.length || !last || !head ? full : byName(last);
        })()
      : [...CATALOG_EFFECTS];
    effects = names.map(effectOf);
    if (!typing) effects.sort((a, b) => b.here - a.here || b.total - a.total);
    effects = effects.filter((e) => e.total > 0).slice(0, typing ? 5 : 12);
  }

  const appDoc = (app: CatalogApp) => APP_DOCS[app.order];
  let appRows = CATALOG.filter((a) => onPlatform(a, platform));
  if (typing) {
    appRows = matching(CATALOG, appDoc, (a) => a, q, platform);
    if (!appRows.length && head)
      appRows = matching(CATALOG, appDoc, (a) => a, head, platform);
  }
  const apps: AppSuggestion[] = appRows
    .filter((a) => a.showcase.slug !== filter.app && withEffect(a))
    .slice(0, typing ? 5 : 9)
    .map((app) => ({
      kind: "app",
      app,
      platform: onPlatform(app, platform)
        ? platform
        : app.showcase.platforms[0],
    }));

  let screens: ScreenSuggestion[] = [];
  if (typing) {
    const allowed = (item: (typeof SCREEN_ITEMS)[number]) =>
      (!filter.app || item.app.showcase.slug === filter.app) &&
      (!filter.effect || item.screen.transition === filter.effect);
    let rows = matching(
      SCREEN_ITEMS.filter(allowed),
      (item) => item.doc,
      (item) => item.app,
      q,
      platform,
    );
    if (!rows.length && head && last) {
      // "youtube wat": the last word among the screens of the apps named first.
      const named = new Set(
        matching(CATALOG, appDoc, (a) => a, head, platform).map((a) => a.order),
      );
      rows = matching(
        SCREEN_ITEMS.filter(
          (item) => allowed(item) && named.has(item.app.order),
        ),
        (item) => item.doc,
        (item) => item.app,
        last,
        platform,
      );
    }
    screens = rows.slice(0, 6).map((item) => ({
      kind: "screen",
      app: item.app,
      screen: item.screen,
    }));
  }

  return { effects, apps, screens };
}
