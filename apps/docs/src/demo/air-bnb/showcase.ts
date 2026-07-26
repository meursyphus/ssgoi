import type { ShowcaseApp } from "@/page/showcase/types";

export const airBnbShowcase: ShowcaseApp = {
  slug: "air-bnb",
  name: "Airbnb",
  tagline: "Zoom blur into listing + sheet checkout with axis-x steps",
  platforms: ["mobile"],
  category: "Travel",
  badge: "New",
  logo: "/airbnb-icon.svg",
  demoOrigin: "/demo/air-bnb",
  transitions: ["zoom", "sheet", "axis"],
  sourcePath: "apps/docs/src/demo/air-bnb",
  previewTransition: "zoom",
  clips: [
    {
      title: "Home → Listing Detail",
      transition: "zoom",
      enterPath: "/demo/air-bnb/listings/l-003",
      exitPath: "/demo/air-bnb",
      caption: "Zoom blur — the tapped card expands into the listing",
    },
    {
      title: "Detail → Checkout Sheet",
      transition: "sheet",
      enterPath: "/demo/air-bnb/listings/l-003/checkout/review",
      exitPath: "/demo/air-bnb/listings/l-003",
      caption: "Sheet static — checkout slides up over the listing",
    },
    {
      title: "Checkout Steps (axis x)",
      transition: "axis",
      enterPath: "/demo/air-bnb/listings/l-003/checkout/method",
      exitPath: "/demo/air-bnb/listings/l-003/checkout/review",
      caption: "Axis x — review ↔ method inside the persistent sheet",
    },
  ],
};
