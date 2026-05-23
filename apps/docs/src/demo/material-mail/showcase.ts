import type { ShowcaseApp } from "@/page/showcase/types";

export const materialMailShowcase: ShowcaseApp = {
  slug: "material-mail",
  name: "Material Mail",
  tagline: "Material You inbox with a sheet/scale compose modal",
  platforms: ["mobile"],
  category: "Productivity",
  badge: "New",
  logo: "/material-mail-icon.svg",
  demoOrigin: "/demo/material-mail",
  transitions: ["sheet"],
  sourcePath: "apps/docs/src/demo/material-mail",
  previewTransition: "sheet",
  clips: [
    {
      title: "Inbox → Compose",
      transition: "sheet",
      enterPath: "/demo/material-mail/compose",
      exitPath: "/demo/material-mail",
      caption: "Compose modal scaling up from the FAB",
    },
  ],
};
