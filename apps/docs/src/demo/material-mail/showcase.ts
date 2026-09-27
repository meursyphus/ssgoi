import type { ShowcaseApp } from "@/page/showcase/types";

export const materialMailShowcase: ShowcaseApp = {
  slug: "material-mail",
  name: "Material Mail",
  tagline:
    "Material You inbox: sheet/scale compose, drill-in mail and z-axis search",
  platforms: ["mobile"],
  category: "Productivity",
  badge: "New",
  logo: "/material-mail-icon.svg",
  demoOrigin: "/demo/material-mail",
  transitions: ["sheet", "drill", "axis"],
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
    {
      title: "Inbox → Mail",
      transition: "drill",
      enterPath: "/demo/material-mail/m/m-001",
      exitPath: "/demo/material-mail",
      caption: "The conversation pushes in over the inbox",
    },
    {
      title: "Inbox → Search",
      transition: "axis",
      enterPath: "/demo/material-mail/search",
      exitPath: "/demo/material-mail",
      caption: "Search surfaces along Material's shared z-axis",
    },
  ],
};
