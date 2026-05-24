import type { ShowcaseApp } from "@/page/showcase/types";

export const airbnbPhotoTourShowcase: ShowcaseApp = {
  slug: "airbnb-photo-tour",
  name: "Airbnb Photo Tour",
  tagline: "Hero transition — gallery tile morphs into the fullscreen photo",
  platforms: ["web"],
  category: "Travel",
  badge: "New",
  logo: "/airbnb-icon.svg",
  demoOrigin: "/demo/airbnb-photo-tour",
  transitions: ["hero"],
  sourcePath: "apps/docs/src/demo/airbnb-photo-tour",
  previewTransition: "hero",
  clips: [
    {
      title: "Gallery → Photo Detail",
      transition: "hero",
      enterPath: "/demo/airbnb-photo-tour/photos/kitchen-1",
      exitPath: "/demo/airbnb-photo-tour",
      caption:
        "Hero (fade) — the tapped gallery image morphs into the fullscreen photo while chrome cross-fades",
    },
  ],
};
