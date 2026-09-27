import type { ShowcaseApp } from "@/page/showcase/types";

const BASE = "/demo/youtube-mobile";

export const youtubeMobileShowcase: ShowcaseApp = {
  slug: "youtube-mobile",
  name: "YouTube Mobile",
  tagline: "Axis-y tabs + zoom expand into the player + drill to channels",
  platforms: ["mobile"],
  category: "Video & Streaming",
  badge: "New",
  logo: "/youtube-mobile-icon.svg",
  demoOrigin: BASE,
  transitions: ["axis", "sheet", "zoom", "drill"],
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
    {
      title: "Home → Watch (zoom expand)",
      transition: "zoom",
      enterPath: `${BASE}/watch/deep-work-desk`,
      exitPath: BASE,
      intervalMs: 3000,
      caption: "The tapped thumbnail grows into the player at the top",
    },
    {
      title: "Subscriptions → Channel (drill)",
      transition: "drill",
      enterPath: `${BASE}/channel/maya-builds`,
      exitPath: `${BASE}/subscriptions`,
      intervalMs: 2800,
      caption: "Channel avatars push the channel page in from the right",
    },
  ],
};
