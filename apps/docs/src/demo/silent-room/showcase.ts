import type { ShowcaseApp } from "@/page/showcase/types";

export const silentRoomShowcase: ShowcaseApp = {
  slug: "silent-room",
  name: "SILENT ROOM",
  tagline: "Fade transition — gallery rooms dissolve one into the next",
  platforms: ["web"],
  category: "Gallery",
  badge: "New",
  logo: "/silent-room-icon.svg",
  demoOrigin: "/demo/silent-room",
  transitions: ["fade"],
  sourcePath: "apps/docs/src/demo/silent-room",
  previewTransition: "fade",
  clips: [
    {
      title: "Stillness → Tension",
      transition: "fade",
      enterPath: "/demo/silent-room/tension",
      exitPath: "/demo/silent-room",
      caption:
        "Fade transition — the gallery dissolves between rooms; nothing moves, only the air changes",
    },
  ],
};
