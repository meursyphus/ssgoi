import type { ShowcaseApp } from "@/page/showcase/types";

export const googlePhotosShowcase: ShowcaseApp = {
  slug: "google-photos",
  name: "Google Photos",
  tagline: "Hero into photos, drill into collections, axis z into search",
  platforms: ["mobile"],
  category: "Photos & Media",
  badge: "New",
  logo: "/google-photos-icon.svg",
  demoOrigin: "/demo/google-photos",
  transitions: ["hero", "drill", "axis", "sheet"],
  sourcePath: "apps/docs/src/demo/google-photos",
  previewTransition: "hero",
  clips: [
    {
      title: "Photos grid → Photo detail (hero)",
      transition: "hero",
      enterPath: "/demo/google-photos/p/ph-001",
      exitPath: "/demo/google-photos",
      caption: "Tapped thumbnail tweens into the fullscreen photo",
    },
    {
      title: "Collections grid → Collection detail (drill)",
      transition: "drill",
      enterPath: "/demo/google-photos/c/col-place",
      exitPath: "/demo/google-photos/collections",
      caption: "Push/pop stack feel between collections",
    },
    {
      title: "Tab swap — Photos → Collections (axis y)",
      transition: "axis",
      enterPath: "/demo/google-photos/collections",
      exitPath: "/demo/google-photos",
      caption: "Non-directional vertical axis on the bottom nav",
    },
    {
      title: "Create → Collage maker (sheet)",
      transition: "sheet",
      enterPath: "/demo/google-photos/collage",
      exitPath: "/demo/google-photos/create",
      caption: "Sheet rises from the Collage tool tile",
    },
    {
      title: "Photos → Search (axis z)",
      transition: "axis",
      enterPath: "/demo/google-photos/search",
      exitPath: "/demo/google-photos",
      caption: "Search button zooms into full-screen search",
    },
    {
      title: "Search → Photo detail (hero)",
      transition: "hero",
      enterPath: "/demo/google-photos/p/ph-002",
      exitPath: "/demo/google-photos/search",
      caption: "Recently added thumbnail morphs into the viewer",
    },
  ],
};
