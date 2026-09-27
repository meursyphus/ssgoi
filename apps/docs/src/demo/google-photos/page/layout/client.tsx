"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { axis, drill, hero, sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";
import { BASE } from "@/demo/google-photos/page/shared/paths";

/** Hub screens that open collections and photos. */
const HUBS = [`${BASE}/search`, `${BASE}/notifications`];

// Rules are resolved by priority, then specificity, then declaration order.
// The exact-path `on` rules (collage, search, notifications, account, new)
// outrank the wildcard ones on every navigation they touch, so the hub → c/*
// and hub → p/* pairs below must be explicit (exact + wildcard beats exact).
const config: SsgoiConfig = {
  transitions: [
    {
      ordered: [BASE, `${BASE}/collections`, `${BASE}/create`],
      transition: axis({ type: "y", variant: "non-directional" }),
    },
    { on: `${BASE}/c/*`, transition: drill() },
    // Photo picker rises as a sheet over the Create tab or the "Create new"
    // sheet. Keep it above `on: new`: new → collage ties on specificity and
    // the earlier rule wins, so the picker rises instead of the menu dropping.
    { on: `${BASE}/collage`, transition: sheet() },
    // A grid thumbnail (Photos tab or a collection) morphs into the viewer;
    // the reverse pair plays it back into the cell. Only grid → photo pairs:
    // Photos → collection (the drill clip's first leg from the iframe origin)
    // falls through to the drill rule instead of a hero with no pair.
    {
      from: [BASE, `${BASE}/c/*`],
      to: `${BASE}/p/*`,
      transition: hero({ type: "fade" }),
    },
    // Search opens a new level over whichever tab is showing.
    { on: `${BASE}/search`, transition: axis({ type: "z" }) },
    { on: `${BASE}/notifications`, transition: drill() },
    { on: `${BASE}/account`, transition: sheet() },
    { on: `${BASE}/new`, transition: sheet() },
    { from: HUBS, to: `${BASE}/c/*`, transition: drill() },
    { from: HUBS, to: `${BASE}/p/*`, transition: hero({ type: "fade" }) },
  ],
};

export function GooglePhotosLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // Boundaries live in the `(tabs)` and `(detail)` route-group layouts.
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-white"
      withTransitionBoundary={false}
    >
      {children}
    </MobileShowcaseShell>
  );
}
