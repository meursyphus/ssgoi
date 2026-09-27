import type { ShowcaseApp } from "@/page/showcase/types";

export const gamjaMarketShowcase: ShowcaseApp = {
  slug: "gamja-market",
  name: "감자마켓",
  tagline: "Drill navigation + sheet review flow",
  platforms: ["mobile"],
  category: "Commerce",
  logo: "/gamja-market-icon.svg",
  demoOrigin: "/demo/gamja-market",
  transitions: ["drill", "sheet", "zoom", "fade"],
  sourcePath: "apps/docs/src/demo/gamja-market",
  previewTransition: "drill",
  clips: [
    {
      title: "Home → Product Detail",
      transition: "drill",
      enterPath: "/demo/gamja-market/products/p-001",
      exitPath: "/demo/gamja-market",
      caption: "Horizontal drill push/pop",
    },
    {
      title: "Home → Write Review",
      transition: "sheet",
      enterPath: "/demo/gamja-market/review/o-001",
      exitPath: "/demo/gamja-market",
      caption: "Modal sheet rising from below",
    },
    {
      title: "Product → Photo Viewer",
      transition: "zoom",
      enterPath: "/demo/gamja-market/products/p-003/photos",
      exitPath: "/demo/gamja-market/products/p-003",
      caption: "Listing photo expands into a full-screen viewer",
    },
    {
      title: "Home → 나의당근 Tab",
      transition: "fade",
      enterPath: "/demo/gamja-market/my",
      exitPath: "/demo/gamja-market",
      caption: "Tab swap while the bottom nav stays put",
    },
  ],
};
