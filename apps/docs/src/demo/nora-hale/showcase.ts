import type { ShowcaseApp } from "@/page/showcase/types";

export const noraHaleShowcase: ShowcaseApp = {
  slug: "nora-hale",
  name: "NORA HALE",
  tagline: "Strip transition — portfolio pages flip like printed pages",
  platforms: ["web"],
  category: "Portfolio",
  badge: "New",
  logo: "/nora-hale-icon.svg",
  demoOrigin: "/demo/nora-hale",
  transitions: ["strip"],
  sourcePath: "apps/docs/src/demo/nora-hale",
  previewTransition: "strip",
  clips: [
    {
      title: "Work Archive → About",
      transition: "strip",
      enterPath: "/demo/nora-hale/about",
      exitPath: "/demo/nora-hale",
      caption:
        "Strip transition — the outgoing page rotates off-screen while the next one peels in from the side",
    },
  ],
};
