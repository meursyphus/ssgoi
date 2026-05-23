import type { ShowcaseApp } from "@/page/showcase/types";

export const gamjaMarketShowcase: ShowcaseApp = {
  slug: "gamja-market",
  name: "감자마켓",
  tagline: "Drill navigation + sheet review flow",
  platforms: ["mobile"],
  category: "Commerce",
  logo: "/gamja-market-icon.svg",
  demoOrigin: "/demo/gamja-market",
  transitions: ["drill", "sheet"],
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
  ],
};
