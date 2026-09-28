import type { ShowcaseApp } from "@/page/showcase/types";
import type { SearchDoc, SearchPlatform } from "./types";

/**
 * Other names people type for a demo, keyed by showcase slug. Kept here rather
 * than in each demo's showcase.ts so the catalog and the palette share one
 * table and demo authors never have to think about search.
 */
export const DEMO_ALIASES: Record<string, string[]> = {
  "youtube-mobile": ["youtube", "yt"],
  "youtube-music-web": ["youtube music", "yt music"],
  "google-photos": ["google photo"],
  "air-bnb": ["airbnb"],
  "airbnb-photo-tour": ["airbnb"],
  instagram: ["insta", "ig"],
  "kakao-talk": ["kakao", "kakaotalk"],
  pinterest: ["pin"],
  "gamja-market": ["gamja", "karrot", "daangn", "marketplace"],
  "material-mail": ["gmail", "mail", "email", "material you"],
};

/**
 * What people type when they mean a docs page but not its title, keyed by
 * href: task words ("getting started", "debug") and API names the page
 * explains. Only terms the page actually answers.
 */
export const DOCS_ALIASES: Record<string, string[]> = {
  "/docs": ["introduction", "overview", "what is ssgoi"],
  "/docs/install": [
    "install",
    "installation",
    "getting started",
    "get started",
    "setup",
  ],
  "/docs/transitions": ["presets", "all transitions"],
  "/docs/route-rules": [
    "SsgoiConfig",
    "config rules",
    "priority",
    "specificity",
  ],
  "/docs/boundaries": [
    "SsgoiRouteBoundary",
    "routeKey",
    "data-ssgoi-transition",
  ],
  "/docs/motion": [
    "spring",
    "duration",
    "timing",
    "speed",
    "stiffness",
    "damping",
    "physics",
  ],
  "/docs/custom-transitions": ["defineTransition", "make your own transition"],
  "/docs/scroll-restoration": ["scroll position", "preserveScroll"],
  "/docs/nested-boundaries": ["nested layout", "tab bar", "parallel routes"],
  "/docs/view-transition-api": ["startViewTransition", "view transitions api"],
  "/docs/compatibility": [
    "browser support",
    "safari",
    "chrome",
    "firefox",
    "ios",
    "android",
  ],
  "/docs/troubleshooting": ["debug", "not working", "no animation", "broken"],
};

/**
 * What people call each transition when they don't know the preset name.
 * Used on the transition's own docs page and on every demo clip that plays it.
 */
export const TRANSITION_TERMS: Record<string, string[]> = {
  hero: ["shared element", "shared", "morph"],
  sheet: [
    "bottom sheet",
    // shadcn/ui's Drawer (vaul) is a bottom sheet
    "drawer",
    "modal",
    "overlay",
    "popup",
  ],
  drill: ["push", "stack", "depth"],
  axis: ["tab", "tabs", "shared axis"],
  slide: ["tab", "tabs", "swipe", "carousel"],
  zoom: ["expand", "card"],
  fade: ["crossfade", "dissolve"],
  scroll: ["vertical"],
  strip: ["page flip", "perspective"],
  film: ["cinematic"],
  rotate: ["spin"],
  jaemin: ["pop", "playful"],
};

function platformOf(platforms: readonly string[]): SearchPlatform {
  if (platforms.includes("web") && platforms.includes("mobile")) return "both";
  return platforms.includes("web") ? "web" : "mobile";
}

/** One demo as a search document. Clip `i` is anchored at `#clip-i`. */
export function showcaseToDoc(showcase: ShowcaseApp): SearchDoc {
  return {
    group: "demos",
    kind: "demo",
    title: showcase.name,
    parent: showcase.category,
    href: `/showcase/${showcase.slug}`,
    text: showcase.tagline,
    terms: showcase.slug.replace(/-/g, " "),
    aliases: DEMO_ALIASES[showcase.slug],
    platform: platformOf(showcase.platforms),
    icon: showcase.logo,
    transitions: showcase.transitions,
    clips: showcase.clips.map((clip) => ({
      title: clip.title,
      transition: clip.transition,
    })),
  };
}
