import type { ShowcaseApp } from "@/page/showcase/types";

const BASE = "/demo/google-photos";

export const googlePhotosShowcase: ShowcaseApp = {
  slug: "google-photos",
  name: "Google Photos",
  tagline: "Hero into photos, drill into collections, axis z into search",
  platforms: ["mobile"],
  category: "Photos & Media",
  badge: "New",
  logo: "/google-photos-icon.svg",
  demoOrigin: BASE,
  transitions: ["hero", "drill", "axis", "sheet"],
  sourcePath: "apps/docs/src/demo/google-photos",
  previewTransition: "hero",
  // ~41 s loop through the bottom-nav tabs in order (Photos → Collections →
  // Create → Photos), two excursions per tab. Each returns with a real
  // history back, so the effect plays in reverse: a thumbnail grows into the
  // viewer and shrinks back into its cell, search zooms in over the grid,
  // collections and notifications drill two levels deep, and the photo
  // picker rises as a sheet — over the Create tab, then over the "Create
  // new" sheet. The middle screen of a two-level excursion (Search, Places,
  // Notifications, Create new) dwells less, so in and out read as one move.
  tourStartLabel: "Photos",
  tour: [
    { push: `${BASE}/p/ph-001`, transition: "hero", label: "Photo" },
    { back: true },
    {
      push: `${BASE}/search`,
      transition: "axis",
      label: "Search",
      dwell: 1200,
    },
    { push: `${BASE}/p/ph-002`, transition: "hero", label: "Photo" },
    { back: true, dwell: 700 },
    { back: true },
    {
      replace: `${BASE}/collections`,
      transition: "axis",
      label: "Collections",
    },
    {
      push: `${BASE}/c/col-place`,
      transition: "drill",
      label: "Places",
      dwell: 1200,
    },
    { push: `${BASE}/p/ph-003`, transition: "hero", label: "Photo" },
    { back: true, dwell: 700 },
    { back: true },
    {
      push: `${BASE}/notifications`,
      transition: "drill",
      label: "Notifications",
      dwell: 1200,
    },
    {
      push: `${BASE}/c/col-people`,
      transition: "drill",
      label: "People & Pets",
    },
    { back: true, dwell: 700 },
    { back: true },
    { replace: `${BASE}/create`, transition: "axis", label: "Create" },
    { push: `${BASE}/collage`, transition: "sheet", label: "Collage" },
    { back: true },
    {
      push: `${BASE}/new`,
      transition: "sheet",
      label: "Create new",
      dwell: 1200,
    },
    {
      push: `${BASE}/collage?tool=album`,
      transition: "sheet",
      label: "New album",
    },
    { back: true, dwell: 700 },
    { back: true },
    { replace: BASE, transition: "axis", label: "Photos" },
  ],
  // One clip per navigation the demo animates, in the order a visitor meets
  // them: the tab swap, the screens each tab opens (a photo, search,
  // a collection, notifications, the Create sheets, account), then the moves
  // one level deeper from those screens. Each player starts on exitPath,
  // pushes enterPath and returns with a real history back.
  clips: [
    {
      title: "Photos → Collections (axis y)",
      transition: "axis",
      enterPath: `${BASE}/collections`,
      exitPath: BASE,
      caption: "Bottom-nav tabs trade places on a soft vertical axis",
    },
    {
      title: "Photos → Photo (hero)",
      transition: "hero",
      enterPath: `${BASE}/p/ph-001`,
      exitPath: BASE,
      caption: "Tapped thumbnail tweens into the fullscreen photo",
    },
    {
      title: "Photos → Search (axis z)",
      transition: "axis",
      enterPath: `${BASE}/search`,
      exitPath: BASE,
      caption: "Search button zooms into full-screen search",
    },
    {
      title: "Collections → Places (drill)",
      transition: "drill",
      enterPath: `${BASE}/c/col-place`,
      exitPath: `${BASE}/collections`,
      caption: "Push/pop stack feel between collections",
    },
    {
      title: "Collections → Notifications (drill)",
      transition: "drill",
      enterPath: `${BASE}/notifications`,
      exitPath: `${BASE}/collections`,
      caption: "The bell in the top bar pushes the activity list in",
    },
    {
      title: "Create → Collage (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/collage`,
      exitPath: `${BASE}/create`,
      caption: "Sheet rises from the Collage tool tile",
    },
    {
      title: "Create → Create new (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/new`,
      exitPath: `${BASE}/create`,
      caption: "The + button raises the Create new menu over the tab",
    },
    {
      title: "Photos → Account (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/account`,
      exitPath: BASE,
      caption: "The avatar raises the account sheet over the grid",
    },
    {
      title: "Places → Photo (hero)",
      transition: "hero",
      enterPath: `${BASE}/p/ph-003`,
      exitPath: `${BASE}/c/col-place`,
      caption: "A collection's thumbnail morphs into the viewer and back",
    },
    {
      title: "Search → Photo (hero)",
      transition: "hero",
      enterPath: `${BASE}/p/ph-002`,
      exitPath: `${BASE}/search`,
      caption: "Recently added thumbnail morphs into the viewer",
    },
    {
      title: "Search → Places (drill)",
      transition: "drill",
      enterPath: `${BASE}/c/col-place`,
      exitPath: `${BASE}/search`,
      caption: "A place tile drills into its collection",
    },
    {
      title: "Notifications → People & Pets (drill)",
      transition: "drill",
      enterPath: `${BASE}/c/col-people`,
      exitPath: `${BASE}/notifications`,
      caption: "An album notification drills into the collection",
    },
    {
      title: "Notifications → Photo (hero)",
      transition: "hero",
      enterPath: `${BASE}/p/ph-001`,
      exitPath: `${BASE}/notifications`,
      caption: "A memory's square thumbnail grows into the photo",
    },
    {
      title: "Create new → New album (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/collage?tool=album`,
      exitPath: `${BASE}/new`,
      caption: "The photo picker stacks a second sheet on the menu",
    },
  ],
};
