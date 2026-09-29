import type { ShowcaseApp } from "@/page/showcase/types";

const BASE = "/demo/gamja-market";

export const gamjaMarketShowcase: ShowcaseApp = {
  slug: "gamja-market",
  name: "Gamja Market",
  tagline: "Drill navigation + sheet review flow",
  platforms: ["mobile"],
  category: "Commerce",
  logo: "/gamja-market-icon.svg",
  demoOrigin: BASE,
  transitions: ["drill", "sheet", "zoom", "fade"],
  sourcePath: "apps/docs/src/demo/gamja-market",
  previewTransition: "drill",
  // ~37 s loop along the bottom tabs (Home → Community → Nearby → Chats →
  // My → Home, a fade each). Each stop opens something and closes it
  // with a real history back, so the drill slides out, the photo shrinks
  // into its listing and the review sheet drops. Three stops go two deep:
  // product → photo viewer, chat's order → review sheet, orders → order.
  tourStartLabel: "Home",
  tour: [
    { push: `${BASE}/products/p-003`, transition: "drill", label: "Product" },
    {
      push: `${BASE}/products/p-003/photos`,
      transition: "zoom",
      label: "Photos",
    },
    { back: true },
    { back: true },
    { replace: `${BASE}/life`, transition: "fade", label: "Community" },
    { replace: `${BASE}/near`, transition: "fade", label: "Nearby" },
    { push: `${BASE}/products/p-002`, transition: "drill", label: "Product" },
    { back: true },
    { replace: `${BASE}/chats`, transition: "fade", label: "Chats" },
    { push: `${BASE}/orders/o-001`, transition: "drill", label: "Order" },
    { push: `${BASE}/review/o-001`, transition: "sheet", label: "Review" },
    { back: true },
    { back: true },
    { replace: `${BASE}/my`, transition: "fade", label: "My" },
    { push: `${BASE}/orders`, transition: "drill", label: "Orders" },
    { push: `${BASE}/orders/o-002`, transition: "drill", label: "Order" },
    { back: true },
    { back: true },
    { replace: BASE, transition: "fade", label: "Home" },
  ],
  // Detail page: one player per flow, tabs first, then the product and
  // order stacks, then the review sheet. Each plays push → real back.
  clips: [
    {
      title: "Home → Community (fade)",
      transition: "fade",
      enterPath: `${BASE}/life`,
      exitPath: BASE,
      caption: "Bottom tabs cross-fade in nav order while the bar stays put",
    },
    {
      title: "Home → My (fade)",
      transition: "fade",
      enterPath: `${BASE}/my`,
      exitPath: BASE,
      caption: "A far tab jump is the same quiet fade, no slide across",
    },
    {
      title: "Home → Product (drill)",
      transition: "drill",
      enterPath: `${BASE}/products/p-003`,
      exitPath: BASE,
      caption: "A listing pushes its product page in from the right",
    },
    {
      title: "Nearby → Product (drill)",
      transition: "drill",
      enterPath: `${BASE}/products/p-002`,
      exitPath: `${BASE}/near`,
      caption: "The store's group-buy grid drills into the same product page",
    },
    {
      title: "Product → Photos (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/products/p-003/photos`,
      exitPath: `${BASE}/products/p-003`,
      caption: "The listing photo expands into a full-screen viewer",
    },
    {
      title: "Chats → Order (drill)",
      transition: "drill",
      enterPath: `${BASE}/orders/o-001`,
      exitPath: `${BASE}/chats`,
      caption: "A store chat opens the order it is about",
    },
    {
      title: "My → Orders (drill)",
      transition: "drill",
      enterPath: `${BASE}/orders`,
      exitPath: `${BASE}/my`,
      caption: "The My tab pushes the order history list",
    },
    {
      title: "Orders → Order (drill)",
      transition: "drill",
      enterPath: `${BASE}/orders/o-002`,
      exitPath: `${BASE}/orders`,
      caption: "Order history and its details share one drill stack",
    },
    {
      title: "Order → Product (drill)",
      transition: "drill",
      enterPath: `${BASE}/products/p-002`,
      exitPath: `${BASE}/orders/o-001`,
      caption: "The ordered item drills forward to its listing, Back pops it",
    },
    {
      title: "Home → Review (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/review/o-001`,
      exitPath: BASE,
      caption: "The pen button raises the review sheet from below",
    },
    {
      title: "Order → Review (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/review/o-001`,
      exitPath: `${BASE}/orders/o-001`,
      caption: "Write review rises over a picked-up order and drops on close",
    },
  ],
};
