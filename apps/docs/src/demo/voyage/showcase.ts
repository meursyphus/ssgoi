import type { ShowcaseApp } from "@/page/showcase/types";

export const voyageShowcase: ShowcaseApp = {
  slug: "voyage",
  name: "Voyage",
  tagline: "Travel-story feed with a sheet/blur compose modal",
  platforms: ["mobile"],
  category: "Travel",
  badge: "New",
  logo: "/voyage-icon.svg",
  demoOrigin: "/demo/voyage",
  transitions: ["sheet"],
  sourcePath: "apps/docs/src/demo/voyage",
  previewTransition: "sheet",
  clips: [
    {
      title: "Feed → New story",
      transition: "sheet",
      enterPath: "/demo/voyage/compose",
      exitPath: "/demo/voyage",
      caption:
        "Sheet blur — the feed blurs and recedes behind the compose sheet",
    },
  ],
};
