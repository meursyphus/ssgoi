import type { ShowcaseApp } from "@/page/showcase/types";

export const voyageShowcase: ShowcaseApp = {
  slug: "voyage",
  name: "Voyage",
  tagline:
    "Travel-story feed: sheet-blur compose, zoom-expand stories, drill into activity",
  platforms: ["mobile"],
  category: "Travel",
  badge: "New",
  logo: "/voyage-icon.svg",
  demoOrigin: "/demo/voyage",
  transitions: ["sheet", "zoom", "drill"],
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
    {
      title: "Story card → Story",
      transition: "zoom",
      enterPath: "/demo/voyage/story/s-001",
      exitPath: "/demo/voyage",
      caption: "Zoom expand + fade — the cover grows into the full story",
    },
    {
      title: "Feed → Activity",
      transition: "drill",
      enterPath: "/demo/voyage/notifications",
      exitPath: "/demo/voyage",
      caption: "Parallax drill from the bell into the activity list",
    },
  ],
};
