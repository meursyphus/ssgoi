export type ShowcasePlatform = "mobile" | "web";

/** GitHub tree URL prefix — paths in showcase data are repo-root-relative folders. */
export const GITHUB_BASE = "https://github.com/meursyphus/ssgoi/tree/latest";

export function githubUrl(path: string): string {
  return `${GITHUB_BASE}/${path.replace(/^\//, "")}`;
}

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

export const showcases: ShowcaseApp[] = [
  {
    slug: "instagram",
    name: "Instagram",
    tagline: "Zoom static into post + slide between profile tabs",
    platforms: ["mobile"],
    category: "Social",
    badge: "New",
    logo: "/instagram-icon.svg",
    demoOrigin: "/demo/instagram",
    transitions: ["zoom", "slide"],
    sourcePath: "apps/docs/src/demo/instagram",
    previewTransition: "zoom",
    clips: [
      {
        title: "Grid → Post Detail",
        transition: "zoom",
        enterPath: "/demo/instagram/feed/p-001",
        exitPath: "/demo/instagram/profile/deaseungseung94",
        caption: "Zoom static — the tapped thumbnail expands into the post",
      },
      {
        title: "Tab slide — Grid → Reels",
        transition: "slide",
        enterPath: "/demo/instagram/profile/deaseungseung94/reels",
        exitPath: "/demo/instagram/profile/deaseungseung94",
        caption: "Inner Ssgoi slides between profile tabs",
      },
    ],
  },
  {
    slug: "pinterest",
    name: "Pinterest",
    tagline: "Zoom expand from masonry pin → feed + drill to search results",
    platforms: ["mobile"],
    category: "Social",
    badge: "New",
    logo: "/pinterest-icon.svg",
    demoOrigin: "/demo/pinterest",
    transitions: ["zoom", "drill"],
    sourcePath: "apps/docs/src/demo/pinterest",
    previewTransition: "zoom",
    clips: [
      {
        title: "Masonry → Feed Detail",
        transition: "zoom",
        enterPath: "/demo/pinterest/feed/pin-1",
        exitPath: "/demo/pinterest",
        caption: "Zoom expand — the tapped pin grows into the feed",
      },
      {
        title: "Search → Result",
        transition: "drill",
        enterPath:
          "/demo/pinterest/search/%EC%97%AC%EC%9E%90%20%EC%B9%98%EB%A7%88",
        exitPath: "/demo/pinterest/search",
        caption: "Horizontal drill push into category results",
      },
    ],
  },
  {
    slug: "ssgoi-docs",
    name: "ssgoi.dev",
    tagline: "Non-directional scroll between landing and showcase",
    platforms: ["web"],
    category: "Docs",
    badge: "New",
    logo: "/ssgoi-logo.png",
    demoOrigin: "/",
    transitions: ["scroll"],
    sourcePath: "apps/docs/src/components/docs-ssgoi-provider.tsx",
    previewTransition: "scroll",
    clips: [
      {
        title: "Landing ↔ Showcase",
        transition: "scroll",
        enterPath: "/showcase",
        exitPath: "/",
        caption:
          "Non-directional scroll — the outgoing page glides up while the incoming page fades in",
      },
    ],
  },
  {
    slug: "youtube-music-web",
    name: "YouTube Music",
    tagline: "Sheet static — content rises while the background stays still",
    platforms: ["web"],
    category: "Music",
    badge: "New",
    logo: "/youtube-music-icon.svg",
    demoOrigin: "/demo/youtube-music-web",
    transitions: ["sheet"],
    sourcePath: "apps/docs/src/demo/youtube-music-web",
    previewTransition: "sheet",
    clips: [
      {
        title: "Home → Now Playing",
        transition: "sheet",
        enterPath: "/demo/youtube-music-web/watch?v=wggigwtz4dQ",
        exitPath: "/demo/youtube-music-web",
        caption: "Sheet rises into the watch screen — static background",
      },
    ],
  },
  {
    slug: "lumen",
    name: "LUMEN",
    tagline: "Film transition — cinematic course pages with a drop-down menu",
    platforms: ["web"],
    category: "Education",
    badge: "New",
    logo: "/lumen-icon.svg",
    demoOrigin: "/demo/lumen",
    transitions: ["film"],
    sourcePath: "apps/docs/src/demo/lumen",
    previewTransition: "film",
    clips: [
      {
        title: "Foundations → Cinematic Eye",
        transition: "film",
        enterPath: "/demo/lumen/cinematic-eye",
        exitPath: "/demo/lumen",
        caption:
          "Film transition — the outgoing course scales down and slides away while the next one rises in",
      },
    ],
  },
  {
    slug: "yuzu-club",
    name: "YUZU CLUB",
    tagline: "Jaemin transition — flavor pages pop in tiny and unwind",
    platforms: ["web"],
    category: "Lifestyle",
    badge: "New",
    logo: "/yuzu-club-icon.svg",
    demoOrigin: "/demo/yuzu-club",
    transitions: ["jaemin"],
    sourcePath: "apps/docs/src/demo/yuzu-club",
    previewTransition: "jaemin",
    clips: [
      {
        title: "Home → Flavors",
        transition: "jaemin",
        enterPath: "/demo/yuzu-club/flavors",
        exitPath: "/demo/yuzu-club",
        caption:
          "Jaemin transition — the next page enters as a tiny rotated card, then unwinds and grows to fill the viewport",
      },
    ],
  },
  {
    slug: "silent-room",
    name: "SILENT ROOM",
    tagline: "Fade transition — gallery rooms dissolve one into the next",
    platforms: ["web"],
    category: "Gallery",
    badge: "New",
    logo: "/silent-room-icon.svg",
    demoOrigin: "/demo/silent-room",
    transitions: ["fade"],
    sourcePath: "apps/docs/src/demo/silent-room",
    previewTransition: "fade",
    clips: [
      {
        title: "Stillness → Tension",
        transition: "fade",
        enterPath: "/demo/silent-room/tension",
        exitPath: "/demo/silent-room",
        caption:
          "Fade transition — the gallery dissolves between rooms; nothing moves, only the air changes",
      },
    ],
  },
  {
    slug: "honeydrop",
    name: "HONEYDROP",
    tagline: "Rotate transition — full-screen drops spin between chapters",
    platforms: ["web"],
    category: "Campaign",
    badge: "New",
    logo: "/honeydrop-icon.svg",
    demoOrigin: "/demo/honeydrop",
    transitions: ["rotate"],
    sourcePath: "apps/docs/src/demo/honeydrop",
    previewTransition: "rotate",
    clips: [
      {
        title: "The Court → The Drop",
        transition: "rotate",
        enterPath: "/demo/honeydrop/drop",
        exitPath: "/demo/honeydrop",
        caption:
          "Rotate transition — the page spins 180° in place while crossfading into the next chapter",
      },
    ],
  },
  {
    slug: "nora-hale",
    name: "NORA HALE",
    tagline: "Strip transition — portfolio pages flip like printed pages",
    platforms: ["web"],
    category: "Portfolio",
    badge: "New",
    logo: "/nora-hale-icon.svg",
    demoOrigin: "/demo/nora-hale",
    transitions: ["strip"],
    sourcePath: "apps/docs/src/demo/nora-hale",
    previewTransition: "strip",
    clips: [
      {
        title: "Work Archive → About",
        transition: "strip",
        enterPath: "/demo/nora-hale/about",
        exitPath: "/demo/nora-hale",
        caption:
          "Strip transition — the outgoing page rotates off-screen while the next one peels in from the side",
      },
    ],
  },
  {
    slug: "gamja-market",
    name: "감자마켓",
    tagline: "Drill navigation + sheet review flow",
    platforms: ["mobile"],
    category: "Commerce",
    logo: "/gamja-market-icon.svg",
    demoOrigin: "/demo/gamja-market",
    transitions: ["drill", "sheet"],
    sourcePath: "apps/docs/src/demo/gamja-market",
    previewTransition: "drill",
    clips: [
      {
        title: "Home → Product Detail",
        transition: "drill",
        enterPath: "/demo/gamja-market/products/p-001",
        exitPath: "/demo/gamja-market",
        caption: "Horizontal drill push/pop",
      },
      {
        title: "Home → Write Review",
        transition: "sheet",
        enterPath: "/demo/gamja-market/review/o-001",
        exitPath: "/demo/gamja-market",
        caption: "Modal sheet rising from below",
      },
    ],
  },
];

export function findShowcase(slug: string): ShowcaseApp | undefined {
  return showcases.find((s) => s.slug === slug);
}

/** All transition names across the catalog, deduped, sorted. */
export function allTransitions(): string[] {
  const seen = new Set<string>();
  for (const s of showcases) for (const t of s.transitions) seen.add(t);
  return [...seen].sort();
}
