import type { ShowcaseApp } from "@/page/showcase/types";

export const youtubeMusicWebShowcase: ShowcaseApp = {
  slug: "youtube-music-web",
  name: "YouTube Music",
  tagline: "Sheet static — content rises while the background stays still",
  platforms: ["web"],
  category: "Music",
  badge: "New",
  logo: "/youtube-music-icon.svg",
  demoOrigin: "/demo/youtube-music-web",
  transitions: ["sheet"],
  sourcePath: "apps/docs/src/demo/youtube-music-web",
  previewTransition: "sheet",
  clips: [
    {
      title: "Home → Now Playing",
      transition: "sheet",
      enterPath: "/demo/youtube-music-web/watch?v=wggigwtz4dQ",
      exitPath: "/demo/youtube-music-web",
      caption: "Sheet rises into the watch screen — static background",
    },
  ],
};
