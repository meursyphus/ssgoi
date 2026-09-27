import type { ShowcaseApp } from "@/page/showcase/types";

export const pinterestShowcase: ShowcaseApp = {
  slug: "pinterest",
  name: "Pinterest",
  tagline: "Zoom expand from masonry pin → feed + drill to search results",
  platforms: ["mobile"],
  category: "Social",
  badge: "New",
  logo: "/pinterest-icon.svg",
  demoOrigin: "/demo/pinterest",
  transitions: ["zoom", "drill", "sheet", "fade"],
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
    {
      title: "Home → Create",
      transition: "sheet",
      enterPath: "/demo/pinterest/create",
      exitPath: "/demo/pinterest",
      caption: "The create menu rises over the feed as a sheet",
    },
    {
      title: "Home → Profile tab",
      transition: "fade",
      enterPath: "/demo/pinterest/profile",
      exitPath: "/demo/pinterest",
      caption: "Tabs swap with a calm fade while the bottom nav stays put",
    },
  ],
};
