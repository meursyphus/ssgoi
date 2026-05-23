export type ShowcasePlatform = "mobile" | "web";

export type ShowcaseClip = {
  /** human-readable label, e.g. "Home → Product Detail" */
  title: string;
  /** ssgoi transition name — used by the search bar's transition filter */
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

export type ShowcaseApp = {
  /** url slug, e.g. "gamja-market" */
  slug: string;
  /** display name, e.g. "감자마켓" */
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
  /** demonstrated transitions (derived from clips, kept explicit for search) */
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
};
