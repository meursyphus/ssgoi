import type { ShowcaseApp } from "@/page/showcase/types";

const BASE = "/demo/voyage";

export const voyageShowcase: ShowcaseApp = {
  slug: "voyage",
  name: "Voyage",
  tagline:
    "Travel-story feed: sheet-blur compose, zoom-expand stories, drill into activity",
  platforms: ["mobile"],
  category: "Travel",
  badge: "New",
  logo: "/voyage-icon.svg",
  demoOrigin: BASE,
  transitions: ["sheet", "zoom", "drill", "fade"],
  sourcePath: "apps/docs/src/demo/voyage",
  previewTransition: "sheet",
  // ~36 s loop from Explore: the top cover zooms into its story, the compose
  // sheet blurs the feed, the bell drills into Activity and on into a story,
  // then the bottom-nav tabs fade in order (Explore → Saved → Trips →
  // Profile → Explore), each zooming its own top cover open. Every push
  // closes with a real history back, so the effect plays in reverse.
  // Story → story ("More stories") stays out of the tour: its tiles sit
  // below the fold of an unscrolled preview, so the zoom first dives down
  // the article. It has its own clip, and the zoom filter nests it inside
  // Profile → Patagonia story.
  tourStartLabel: "Explore",
  tour: [
    { push: `${BASE}/story/s-001`, transition: "zoom", label: "Kyoto story" },
    { back: true },
    { push: `${BASE}/compose`, transition: "sheet", label: "New story" },
    { back: true },
    { push: `${BASE}/notifications`, transition: "drill", label: "Activity" },
    { push: `${BASE}/story/s-006`, transition: "drill", label: "Jeju story" },
    { back: true },
    { back: true },
    { replace: `${BASE}/saved`, transition: "fade", label: "Saved" },
    { push: `${BASE}/story/s-002`, transition: "zoom", label: "Tromsø story" },
    { back: true },
    { replace: `${BASE}/trips`, transition: "fade", label: "Trips" },
    { push: `${BASE}/story/s-005`, transition: "zoom", label: "Lisbon story" },
    { back: true },
    { replace: `${BASE}/profile`, transition: "fade", label: "Profile" },
    {
      push: `${BASE}/story/s-004`,
      transition: "zoom",
      label: "Patagonia story",
    },
    { back: true },
    { replace: BASE, transition: "fade", label: "Explore" },
  ],
  // One clip per flow, in reading order: the tab fade, each tab's story
  // zoom, the compose sheet, the Activity drill chain, then story → story.
  // Each pushes enterPath from exitPath, then goes back with a real Back.
  // The zoom and drill pairs repeat the tour's, so search treats them as
  // the same screens.
  clips: [
    {
      title: "Explore → Saved (fade)",
      transition: "fade",
      enterPath: `${BASE}/saved`,
      exitPath: BASE,
      caption:
        "Bottom-nav tabs cross-fade in order while the nav bar stays put",
    },
    {
      title: "Explore → Story (zoom expand)",
      transition: "zoom",
      enterPath: `${BASE}/story/s-001`,
      exitPath: BASE,
      caption: "Zoom expand + fade — the feed cover grows into the full story",
    },
    {
      title: "Saved → Story (zoom expand)",
      transition: "zoom",
      enterPath: `${BASE}/story/s-002`,
      exitPath: `${BASE}/saved`,
      caption: "A bookmarked cover opens into the reader; Back folds it away",
    },
    {
      title: "Trips → Story (zoom expand)",
      transition: "zoom",
      enterPath: `${BASE}/story/s-005`,
      exitPath: `${BASE}/trips`,
      caption: "The upcoming-trip card expands into its Lisbon trip guide",
    },
    {
      title: "Profile → Story (zoom expand)",
      transition: "zoom",
      enterPath: `${BASE}/story/s-004`,
      exitPath: `${BASE}/profile`,
      caption: "A Recently read tile zooms open and shrinks back into the grid",
    },
    {
      title: "Explore → New story (sheet blur)",
      transition: "sheet",
      enterPath: `${BASE}/compose`,
      exitPath: BASE,
      caption:
        "Sheet blur — the feed blurs and recedes behind the compose sheet",
    },
    {
      title: "Explore → Activity (drill)",
      transition: "drill",
      enterPath: `${BASE}/notifications`,
      exitPath: BASE,
      caption: "Parallax drill from the bell into the activity list",
    },
    {
      title: "Activity → Story (drill)",
      transition: "drill",
      enterPath: `${BASE}/story/s-006`,
      exitPath: `${BASE}/notifications`,
      caption: "An activity row keeps drilling forward into its story",
    },
    {
      title: "Story → Story (zoom expand)",
      transition: "zoom",
      enterPath: `${BASE}/story/s-005`,
      exitPath: `${BASE}/story/s-004`,
      caption:
        "The view dives to a More stories tile, which grows into the next story",
    },
  ],
};
