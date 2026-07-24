"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { axis, drill, hero, sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/google-photos";

const config: SsgoiConfig = {
  // Always preserve scroll inside the mobile-frame.
  preserveScroll: true,
  transitions: [
    {
      ordered: [BASE, `${BASE}/collections`, `${BASE}/create`],
      transition: axis({ type: "y", variant: "non-directional" }),
    },
    { on: `${BASE}/c/*`, transition: drill() },
    // Collage maker rises as a sheet over the Create tab.
    { on: `${BASE}/collage`, transition: sheet() },
    // Every detail screen has its own chrome (back button, meta) that the
    // surrounding tabs don't share, so cross-fade chrome on both pairs.
    // BASE↔c/* also matches this rule, but no UI flow triggers it.
    {
      from: [BASE, `${BASE}/c/*`, `${BASE}/p/*`],
      to: [BASE, `${BASE}/c/*`, `${BASE}/p/*`],
      transition: hero({ type: "fade" }),
    },
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
