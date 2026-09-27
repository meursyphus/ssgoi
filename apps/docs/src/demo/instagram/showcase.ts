import type { ShowcaseApp } from "@/page/showcase/types";

export const instagramShowcase: ShowcaseApp = {
  slug: "instagram",
  name: "Instagram",
  tagline: "Zoom into posts and stories + sheet create + slide between tabs",
  platforms: ["mobile"],
  category: "Social",
  badge: "New",
  logo: "/instagram-icon.svg",
  demoOrigin: "/demo/instagram",
  transitions: ["zoom", "slide", "sheet"],
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
    {
      // 클립 iframe은 exitPath(그리드 탭)에서 시작한다 — 첫 enter부터 줌이
      // 걸리려면 출발 원(하이라이트)이 exitPath 화면에 있어야 한다.
      title: "Highlight → Story",
      transition: "zoom",
      enterPath: "/demo/instagram/stories/hl-blog",
      exitPath: "/demo/instagram/profile/deaseungseung94",
      caption: "Zoom expand — the highlight circle opens into the story",
    },
    {
      title: "New post sheet",
      transition: "sheet",
      enterPath: "/demo/instagram/create",
      exitPath: "/demo/instagram/profile/deaseungseung94",
      caption: "The create flow slides up over the profile",
    },
  ],
};
