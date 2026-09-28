import type { ShowcaseApp } from "@/page/showcase/types";

const BASE = "/demo/material-mail";

export const materialMailShowcase: ShowcaseApp = {
  slug: "material-mail",
  name: "Material Mail",
  tagline:
    "Material You inbox: sheet/scale compose, drill-in mail and z-axis search",
  platforms: ["mobile"],
  category: "Productivity",
  badge: "New",
  logo: "/material-mail-icon.svg",
  demoOrigin: BASE,
  transitions: ["sheet", "drill", "axis", "fade"],
  sourcePath: "apps/docs/src/demo/material-mail",
  previewTransition: "sheet",
  // Loop from the inbox: the FAB's compose sheet, a conversation with a
  // reply sheet on top of it (depth 2), search along the z-axis into a
  // result, then a fade-through of every bottom-nav tab back to Mail. Each
  // push closes with a real history back, so the effect plays in reverse.
  tourStartLabel: "Inbox",
  tour: [
    { push: `${BASE}/compose`, transition: "sheet", label: "Compose" },
    { back: true },
    {
      push: `${BASE}/m/m-001`,
      transition: "drill",
      label: "Mail",
      dwell: 1800,
    },
    {
      push: `${BASE}/compose?reply=m-001&mode=reply`,
      transition: "sheet",
      label: "Reply",
      dwell: 1800,
    },
    { back: true },
    { back: true },
    { push: `${BASE}/search`, transition: "axis", label: "Search" },
    {
      push: `${BASE}/m/m-003`,
      transition: "drill",
      label: "Mail",
      dwell: 1800,
    },
    { back: true },
    { back: true },
    { replace: `${BASE}/meet`, transition: "fade", label: "Meet", dwell: 1000 },
    { replace: `${BASE}/chat`, transition: "fade", label: "Chat", dwell: 1000 },
    {
      replace: `${BASE}/spaces`,
      transition: "fade",
      label: "Spaces",
      dwell: 1000,
    },
    { replace: BASE, transition: "fade", label: "Inbox", dwell: 1600 },
  ],
  // One clip per flow: the bottom-nav tabs, the three ways out of the inbox
  // (drill, z-axis, sheet), then the second-level moves from search and a
  // conversation. Each player starts on `exitPath`, pushes `enterPath` and
  // returns with a real back.
  clips: [
    {
      title: "Inbox → Meet (fade)",
      transition: "fade",
      enterPath: `${BASE}/meet`,
      exitPath: BASE,
      caption:
        "Bottom-nav fade-through: only the page swaps, the nav stays put",
    },
    {
      title: "Meet → Chat (fade)",
      transition: "fade",
      enterPath: `${BASE}/chat`,
      exitPath: `${BASE}/meet`,
      caption:
        "The New chat FAB belongs to the page, so it fades through with it",
    },
    {
      title: "Chat → Spaces (fade)",
      transition: "fade",
      enterPath: `${BASE}/spaces`,
      exitPath: `${BASE}/chat`,
      caption: "Sibling hubs trade places with the same M3 fade-through",
    },
    {
      title: "Inbox → Mail (drill)",
      transition: "drill",
      enterPath: `${BASE}/m/m-001`,
      exitPath: BASE,
      caption: "The conversation pushes in over the inbox",
    },
    {
      title: "Inbox → Search (axis z)",
      transition: "axis",
      enterPath: `${BASE}/search`,
      exitPath: BASE,
      caption: "Search surfaces along Material's shared z-axis",
    },
    {
      title: "Inbox → Compose (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/compose`,
      exitPath: BASE,
      caption: "Compose modal scaling up from the FAB",
    },
    {
      title: "Search → Mail (drill)",
      transition: "drill",
      enterPath: `${BASE}/m/m-003`,
      exitPath: `${BASE}/search`,
      caption: "A result drills into the conversation instead of reversing z",
    },
    {
      title: "Mail → Reply (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/compose?reply=m-001&mode=reply`,
      exitPath: `${BASE}/m/m-001`,
      caption:
        "Reply raises the same compose sheet over the conversation it quotes",
    },
  ],
};
