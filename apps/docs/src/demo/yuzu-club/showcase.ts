import type { ShowcaseApp } from "@/page/showcase/types";

export const yuzuClubShowcase: ShowcaseApp = {
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
};
