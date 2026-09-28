export type ShowcasePlatform = "mobile" | "web";

export type ShowcaseClip = {
  /** human-readable label, e.g. "Home → Product Detail" */
  title: string;
  /** ssgoi transition name; site search matches it and its synonyms */
  transition: string;
  /**
   * Path the iframe routes _to_ when the clip plays the "enter" leg.
   * Absolute path within this docs site (e.g. "/demo/gamja-market/products/1").
   */
  enterPath: string;
  /**
   * Path the iframe routes _back to_ when the clip plays the "exit" leg.
   * The detail page toggles between enterPath and exitPath on an interval.
   */
  exitPath: string;
  /** auto-toggle interval in ms (default 2400) */
  intervalMs?: number;
  /** optional short caption */
  caption?: string;
};

/**
 * One move of a showcase's self-playing preview tour (landing card).
 *
 * - `push` opens a screen with a history push. Every push must be closed by
 *   a later `back`, which is a real `history.back()`: SSGOI replays the
 *   push's effect in reverse (zoom back into the tile, sheet down, drill out).
 * - `back` returns from the most recent open push.
 * - `replace` swaps the current screen without stacking history: tab and
 *   top-level switches. An `ordered` rule animates it by list position, so
 *   replacing back to the first tab plays the axis backward.
 *
 * `transition` names the effect the move plays (for a `back`, the effect of
 * the push it closes); search filters and effect loops read it. `label`
 * names the screen the move lands on ("Watch", "Channel"). `dwell` is how
 * long the card holds the screen after the move settles, in ms (defaults:
 * push 1500, back 1000, replace 1300).
 */
export type ShowcaseTourStep =
  | { push: string; transition: string; label?: string; dwell?: number }
  | { back: true; dwell?: number }
  | { replace: string; transition: string; label?: string; dwell?: number };

export type ShowcaseApp = {
  /** url slug, e.g. "gamja-market" */
  slug: string;
  /** display name, e.g. "Gamja Market" */
  name: string;
  /** short tagline shown on the card */
  tagline: string;
  /** which form factor(s) this showcase ships */
  platforms: ShowcasePlatform[];
  /** category tag, e.g. "Commerce", "Travel", "Productivity" */
  category: string;
  /** optional badge such as "New" / "Updated" */
  badge?: "New" | "Updated";
  /** Square app-icon URL (served from /public). Shown on cards and the detail header. */
  logo?: string;
  /**
   * Iframe origin for this showcase — any path under this prefix is treated
   * as belonging to the same demo shell, so we can postMessage-navigate within it.
   */
  demoOrigin: string;
  /**
   * Every transition this showcase demonstrates, kept explicit for search
   * and the card badges. Must include each clip's and each tour step's
   * `transition` (the tour validator warns about a missing one).
   */
  transitions: string[];
  /** Repo-relative path to the layout/transition config — shown as a "Setup" link in detail. */
  sourcePath?: string;
  /**
   * Transition name (matching one of `clips[*].transition`) used as the
   * auto-playing preview on the list card. Defaults to the first clip.
   */
  previewTransition?: string;
  /** clip list — detail page renders one iframe per clip */
  clips: ShowcaseClip[];
  /**
   * The landing card's self-playing route loop, from `tourStart` back to
   * `tourStart`. Invariants (checked by `validateTour`): pushes and backs
   * balance, depth never goes below 0 or above 2, every path is under
   * `demoOrigin`, no move targets the screen it starts on, and the last
   * step ends on `tourStart` so the loop restarts without a cut (usually a
   * `replace` back to the first tab, which the `ordered` rule animates).
   * Without a tour the card derives one from `clips` (exitPath → push
   * enterPath → back, one clip after another).
   */
  tour?: ShowcaseTourStep[];
  /** Where the tour starts and ends. Defaults to `demoOrigin`. */
  tourStart?: string;
  /** Screen name for `tourStart` in the card caption. Defaults to "Home". */
  tourStartLabel?: string;
};
