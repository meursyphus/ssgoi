import type { ShowcaseApp } from "@/page/showcase/types";

export const instagramShowcase: ShowcaseApp = {
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
};
