import type { ShowcaseApp } from "@/page/showcase/types";

const BASE = "/demo/youtube-mobile";

export const youtubeMobileShowcase: ShowcaseApp = {
  slug: "youtube-mobile",
  name: "YouTube Mobile",
  tagline: "Slow vertical tab cross-fade with a nav-free create sheet",
  platforms: ["mobile"],
  category: "Video & Streaming",
  badge: "New",
  logo: "/youtube-mobile-icon.svg",
  demoOrigin: BASE,
  transitions: ["axis", "sheet"],
  sourcePath: "apps/docs/src/demo/youtube-mobile",
  previewTransition: "axis",
  clips: [
    {
      title: "Home → Subscriptions (axis y)",
      transition: "axis",
      enterPath: `${BASE}/subscriptions`,
      exitPath: BASE,
      intervalMs: 2800,
      caption:
        "Every bottom-nav destination rises through the same soft cross-fade",
    },
    {
      title: "Home → Create (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/create`,
      exitPath: BASE,
      intervalMs: 3000,
      caption: "The create surface rises without carrying the bottom nav",
    },
  ],
};
