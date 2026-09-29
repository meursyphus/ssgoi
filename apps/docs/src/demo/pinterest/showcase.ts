import type { ShowcaseApp } from "@/page/showcase/types";

const BASE = "/demo/pinterest";
const search = (query: string) => `${BASE}/search/${encodeURIComponent(query)}`;

export const pinterestShowcase: ShowcaseApp = {
  slug: "pinterest",
  name: "Pinterest",
  tagline: "Masonry zoom into pins + drill to results + sheet share & create",
  platforms: ["mobile"],
  category: "Social",
  badge: "New",
  logo: "/pinterest-icon.svg",
  demoOrigin: BASE,
  transitions: ["zoom", "drill", "sheet", "fade"],
  sourcePath: "apps/docs/src/demo/pinterest",
  previewTransition: "zoom",
  // ~37 s loop through the bottom-nav tabs in order (Home → Search →
  // Profile → Home). Every pin opens with a zoom out of the tile it came
  // from and closes with a real history back, so the pin shrinks back into
  // that tile; the sheet and drill screens close the same way.
  tourStartLabel: "Home",
  tour: [
    // Home: masonry tile → pin close-up → share sheet over it.
    { push: `${BASE}/feed/pin-2`, transition: "zoom", label: "Pin" },
    { push: `${BASE}/feed/pin-2/share`, transition: "sheet", label: "Share" },
    { back: true },
    { back: true },
    // Home header → inbox; a tiny update thumbnail grows into its pin.
    { push: `${BASE}/inbox`, transition: "drill", label: "Inbox" },
    { push: `${BASE}/feed/pin-13`, transition: "zoom", label: "Pin" },
    { back: true },
    { back: true },
    // Search tab: hero banner → results → a result pin.
    { replace: `${BASE}/search`, transition: "fade", label: "Search" },
    { push: search("aesthetic"), transition: "drill", label: "Results" },
    { push: `${BASE}/feed/pin-4`, transition: "zoom", label: "Pin" },
    { back: true },
    { back: true },
    // Profile tab: a board opens its ideas.
    { replace: `${BASE}/profile`, transition: "fade", label: "Profile" },
    { push: search("멋진 발명품"), transition: "drill", label: "Board" },
    { back: true },
    // Back to the first tab, then the create sheet; the loop restarts on
    // Home.
    { replace: BASE, transition: "fade", label: "Home" },
    { push: `${BASE}/create`, transition: "sheet", label: "Create" },
    { back: true },
  ],
  clips: [
    // Tabs first, then list → detail flows, sheets, and the deeper flows
    // off a results page or a pin. Each clip pushes enterPath from exitPath
    // and closes with a real Back, so both legs play the named effect.
    {
      title: "Home → Profile (fade)",
      transition: "fade",
      enterPath: `${BASE}/profile`,
      exitPath: BASE,
      intervalMs: 2400,
      caption: "Bottom-nav tabs cross-fade while the nav bar stays put",
    },
    {
      title: "Home → Pin (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/feed/pin-1`,
      exitPath: BASE,
      intervalMs: 2800,
      caption: "The tapped masonry tile expands into the pin close-up",
    },
    {
      title: "Search → Results (drill)",
      transition: "drill",
      enterPath: search("여자 치마"),
      exitPath: `${BASE}/search`,
      intervalMs: 2600,
      caption: "An idea card pushes its results page in from the right",
    },
    {
      title: "Results → Pin (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/feed/pin-4`,
      exitPath: search("aesthetic"),
      intervalMs: 2800,
      caption:
        "A result tile grows into its pin; Back shrinks it into the grid",
    },
    {
      title: "Home → Inbox (drill)",
      transition: "drill",
      enterPath: `${BASE}/inbox`,
      exitPath: BASE,
      intervalMs: 2600,
      caption: "The header's inbox button slides the updates list in",
    },
    {
      title: "Inbox → Pin (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/feed/pin-13`,
      exitPath: `${BASE}/inbox`,
      intervalMs: 2800,
      caption:
        "The list holds still while the tiny thumbnail grows into its pin",
    },
    {
      title: "Profile → Board (drill)",
      transition: "drill",
      enterPath: search("멋진 발명품"),
      exitPath: `${BASE}/profile`,
      intervalMs: 2600,
      caption: "A board cover opens the board's ideas",
    },
    {
      title: "Home → Create (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/create`,
      exitPath: BASE,
      intervalMs: 2600,
      caption: "The create menu rises over the feed as a sheet",
    },
    {
      title: "Pin → Share (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/feed/pin-2/share`,
      exitPath: `${BASE}/feed/pin-2`,
      intervalMs: 2600,
      caption: "The share sheet rises over the pin close-up",
    },
    {
      title: "Pin → Similar ideas (drill)",
      transition: "drill",
      enterPath: search("만년필"),
      exitPath: `${BASE}/feed/pin-2`,
      intervalMs: 2600,
      caption: "The lens button on a pin drills into more ideas like it",
    },
    {
      title: "Results → Refined results (drill)",
      transition: "drill",
      enterPath: search("만년필 잉크"),
      exitPath: search("만년필"),
      intervalMs: 2600,
      caption: "A guided-search chip refines the query into a new results page",
    },
    {
      title: "Pin → Related pin (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/feed/pin-3`,
      exitPath: `${BASE}/feed/pin-1`,
      intervalMs: 2800,
      caption: "A related pin below the close-up expands into its own close-up",
    },
  ],
};
