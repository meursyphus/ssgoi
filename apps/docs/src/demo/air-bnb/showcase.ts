import type { ShowcaseApp } from "@/page/showcase/types";

const BASE = "/demo/air-bnb";

export const airBnbShowcase: ShowcaseApp = {
  slug: "air-bnb",
  name: "Airbnb",
  tagline: "Zoom blur into listing + sheet checkout with axis-x steps",
  platforms: ["mobile"],
  category: "Travel",
  badge: "New",
  logo: "/airbnb-icon.svg",
  demoOrigin: "/demo/air-bnb",
  transitions: ["zoom", "hero", "sheet", "axis", "fade", "drill"],
  sourcePath: "apps/docs/src/demo/air-bnb",
  previewTransition: "zoom",
  // ~45 s loop. Explore: a card zooms into its listing, which opens the
  // photo tour (hero), then closes back into the card. Search rises as a
  // blurred sheet and drops onto Busan's results, then rises again on the
  // way out. Another card opens its listing and the checkout sheet
  // (review → payment → confirm on the axis) before closing. The bottom nav
  // then fades through every tab in order: Wishlists drills into a list
  // whose card zooms open, then Trips, Messages and Profile fade back to
  // Explore. Every push closes with a real back, and no excursion runs
  // longer than ~11 s, so the other cards' previews never wait long on it.
  tourStartLabel: "Explore",
  tour: [
    { push: `${BASE}/listings/l-003`, transition: "zoom", label: "Listing" },
    {
      push: `${BASE}/listings/l-003/photos`,
      transition: "hero",
      label: "Photo tour",
    },
    { back: true },
    { back: true },
    { push: `${BASE}/search`, transition: "sheet", label: "Search" },
    {
      push: `${BASE}/collections/busan`,
      transition: "sheet",
      label: "Homes in Busan",
    },
    { back: true },
    { back: true },
    {
      push: `${BASE}/listings/l-001`,
      transition: "zoom",
      label: "Listing",
      dwell: 1200,
    },
    {
      push: `${BASE}/listings/l-001/checkout/review`,
      transition: "sheet",
      label: "Checkout",
    },
    {
      replace: `${BASE}/listings/l-001/checkout/method`,
      transition: "axis",
      label: "Payment",
      dwell: 1000,
    },
    {
      replace: `${BASE}/listings/l-001/checkout/confirm`,
      transition: "axis",
      label: "Confirm",
      dwell: 1000,
    },
    { back: true, dwell: 900 },
    { back: true },
    { replace: `${BASE}/wishlists`, transition: "fade", label: "Wishlists" },
    {
      push: `${BASE}/collections/recently-viewed`,
      transition: "drill",
      label: "Recently viewed",
    },
    { push: `${BASE}/listings/l-004`, transition: "zoom", label: "Listing" },
    { back: true },
    { back: true },
    {
      replace: `${BASE}/trips`,
      transition: "fade",
      label: "Trips",
      dwell: 900,
    },
    {
      replace: `${BASE}/messages`,
      transition: "fade",
      label: "Messages",
      dwell: 700,
    },
    {
      replace: `${BASE}/profile`,
      transition: "fade",
      label: "Profile",
      dwell: 900,
    },
    { replace: BASE, transition: "fade", label: "Explore" },
  ],
  // One clip per flow: tabs, the three zoom sources and the see-all drill,
  // then the listing's hero and the sheets (search, checkout) with their
  // inner moves. Each plays push enterPath from exitPath, then a real back.
  clips: [
    {
      title: "Explore → Wishlists (fade)",
      transition: "fade",
      enterPath: `${BASE}/wishlists`,
      exitPath: BASE,
      caption: "Fade — bottom-nav tabs cross-fade in tab order",
    },
    {
      title: "Explore → Listing (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/listings/l-003`,
      exitPath: BASE,
      caption: "Zoom blur — the tapped card expands into the listing",
    },
    {
      title: "Trips → Listing (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/listings/l-002`,
      exitPath: `${BASE}/trips`,
      caption: "Zoom blur — the upcoming reservation opens its listing",
    },
    {
      title: "Explore → Popular homes (drill)",
      transition: "drill",
      enterPath: `${BASE}/collections/popular-seoul`,
      exitPath: BASE,
      caption: "Drill — a “see all” row pushes its full list",
    },
    {
      title: "Wishlists → Recently viewed (drill)",
      transition: "drill",
      enterPath: `${BASE}/collections/recently-viewed`,
      exitPath: `${BASE}/wishlists`,
      caption: "Drill — a wishlist opens its saved homes as a pushed list",
    },
    {
      title: "Popular homes → Listing (zoom)",
      transition: "zoom",
      enterPath: `${BASE}/listings/l-001`,
      exitPath: `${BASE}/collections/popular-seoul`,
      caption: "Zoom blur — list cards zoom open instead of drilling",
    },
    {
      title: "Listing → Photo tour (hero)",
      transition: "hero",
      enterPath: `${BASE}/listings/l-003/photos`,
      exitPath: `${BASE}/listings/l-003`,
      caption:
        "Hero fade — the cover grows into the tour; Back returns it to the cover",
    },
    {
      title: "Explore → Search (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/search`,
      exitPath: BASE,
      caption: "Sheet blur — search rises over a blurred Explore feed",
    },
    {
      title: "Search → Homes in Busan (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/collections/busan`,
      exitPath: `${BASE}/search`,
      caption: "Sheet blur — picking a destination drops search onto results",
    },
    {
      title: "Listing → Checkout (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/listings/l-001/checkout/review`,
      exitPath: `${BASE}/listings/l-001`,
      caption: "Sheet static — checkout slides up over the listing",
    },
    {
      title: "Checkout → Payment (axis)",
      transition: "axis",
      enterPath: `${BASE}/listings/l-001/checkout/method`,
      exitPath: `${BASE}/listings/l-001/checkout/review`,
      caption: "Axis x — review ↔ payment inside the persistent sheet",
    },
    {
      title: "Confirm → Trips (sheet)",
      transition: "sheet",
      enterPath: `${BASE}/trips`,
      exitPath: `${BASE}/listings/l-001/checkout/confirm`,
      caption: "Sheet static — booking drops the sheet onto Trips",
    },
  ],
};
