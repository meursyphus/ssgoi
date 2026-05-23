import type { ShowcaseApp } from "@/page/showcase/types";

export const lumenShowcase: ShowcaseApp = {
  slug: "lumen",
  name: "LUMEN",
  tagline: "Film transition — cinematic course pages with a drop-down menu",
  platforms: ["web"],
  category: "Education",
  badge: "New",
  logo: "/lumen-icon.svg",
  demoOrigin: "/demo/lumen",
  transitions: ["film"],
  sourcePath: "apps/docs/src/demo/lumen",
  previewTransition: "film",
  clips: [
    {
      title: "Foundations → Cinematic Eye",
      transition: "film",
      enterPath: "/demo/lumen/cinematic-eye",
      exitPath: "/demo/lumen",
      caption:
        "Film transition — the outgoing course scales down and slides away while the next one rises in",
    },
  ],
};
