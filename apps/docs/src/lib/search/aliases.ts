import type { ShowcaseApp } from "@/page/showcase/types";
import type { SearchDoc, SearchPlatform } from "./types";

/**
 * Other names people type for a demo, keyed by showcase slug. Kept here rather
 * than in each demo's showcase.ts so the catalog and the palette share one
 * table and demo authors never have to think about search.
 */
export const DEMO_ALIASES: Record<string, string[]> = {
  "youtube-mobile": ["유튜브", "youtube", "yt"],
  "youtube-music-web": ["유튜브 뮤직", "youtube music", "yt music"],
  "google-photos": ["구글 포토", "구글포토", "google photo"],
  "air-bnb": ["에어비앤비", "에어비엔비", "airbnb"],
  "airbnb-photo-tour": ["에어비앤비", "에어비엔비", "airbnb"],
  instagram: ["인스타그램", "인스타", "insta", "ig"],
  "kakao-talk": ["카카오톡", "카톡", "카카오", "kakao"],
  pinterest: ["핀터레스트", "핀터", "pin"],
  "gamja-market": ["감자마켓", "당근마켓", "당근", "gamja", "karrot", "daangn"],
  "material-mail": ["지메일", "gmail", "메일", "email", "material you"],
  voyage: ["보야지"],
  lumen: ["루멘"],
  "yuzu-club": ["유자"],
};

/**
 * What people type when they mean a docs page but not its title, keyed by
 * href: task words ("getting started", "debug"), API names the page explains,
 * and Korean. Only terms the page actually answers.
 */
export const DOCS_ALIASES: Record<string, string[]> = {
  "/docs": ["introduction", "overview", "what is ssgoi", "소개"],
  "/docs/install": [
    "install",
    "installation",
    "getting started",
    "get started",
    "setup",
    "설치",
    "시작하기",
  ],
  "/docs/transitions": ["presets", "all transitions", "트랜지션", "전환"],
  "/docs/route-rules": [
    "SsgoiConfig",
    "config rules",
    "priority",
    "specificity",
    "라우트 규칙",
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
  "/docs/scroll-restoration": ["scroll position", "preserveScroll", "스크롤"],
  "/docs/nested-boundaries": ["nested layout", "tab bar", "parallel routes"],
  "/docs/view-transition-api": ["startViewTransition", "view transitions api"],
  "/docs/compatibility": [
    "browser support",
    "safari",
    "chrome",
    "firefox",
    "ios",
    "android",
    "호환성",
  ],
  "/docs/troubleshooting": [
    "debug",
    "not working",
    "no animation",
    "broken",
    "문제 해결",
  ],
};

/**
 * What people call each transition when they don't know the preset name.
 * Used on the transition's own docs page and on every demo clip that plays it.
 */
export const TRANSITION_TERMS: Record<string, string[]> = {
  hero: ["shared element", "shared", "morph", "공유 요소", "히어로"],
  sheet: [
    "bottom sheet",
    "modal",
    "overlay",
    "popup",
    "바텀시트",
    "모달",
    "시트",
  ],
  drill: ["push", "stack", "depth", "드릴", "푸시"],
  axis: ["tab", "tabs", "shared axis", "탭"],
  slide: ["tab", "tabs", "swipe", "carousel", "슬라이드"],
  zoom: ["expand", "card", "줌", "확대"],
  fade: ["crossfade", "dissolve", "페이드"],
  scroll: ["vertical", "스크롤"],
  strip: ["page flip", "perspective"],
  film: ["cinematic"],
  rotate: ["spin", "회전"],
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
