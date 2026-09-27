"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import {
  axis,
  drill,
  fade,
  hero,
  sheet,
  zoom,
} from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/air-bnb";

/** Bottom-nav order. Tabs swap with a quiet fade, like UITabBarController. */
const TABS = [
  BASE,
  `${BASE}/wishlists`,
  `${BASE}/trips`,
  `${BASE}/messages`,
  `${BASE}/profile`,
];

const config: SsgoiConfig = {
  transitions: [
    // Any list with listing cards → listing detail. A pair scores both
    // sides, so collections → listing stays zoom instead of the drill below.
    {
      from: [BASE, `${BASE}/trips`, `${BASE}/collections/*`],
      to: `${BASE}/listings/:id`,
      transition: zoom({ type: "blur", variant: "fade" }),
    },
    // Reserve → checkout, and leaving checkout (close, or Confirm → Trips).
    {
      on: `${BASE}/listings/:id/checkout/*`,
      transition: sheet({ type: "static" }),
    },
    {
      priority: 10,
      ordered: ["review", "method", "confirm"].map(
        (step) => `${BASE}/listings/:id/checkout/${step}`,
      ),
      transition: axis({ type: "x" }),
    },
    { ordered: TABS, transition: fade() },
    // Full-screen search modal. The exact path outranks the collections
    // drill, so Search → results drops the modal onto the results.
    { on: `${BASE}/search`, transition: sheet({ type: "blur" }) },
    // "See all" lists push like an iOS navigation stack.
    { on: `${BASE}/collections/*`, transition: drill() },
    // The listing hero photo grows into the first photo of the tour.
    {
      from: `${BASE}/listings/:id`,
      to: `${BASE}/listings/:id/photos`,
      transition: hero({ type: "fade" }),
    },
  ],
};

export function AirBnbLayoutClient({ children }: { children: ReactNode }) {
  return (
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-white"
      withTransitionBoundary={false}
    >
      {children}
    </MobileShowcaseShell>
  );
}
