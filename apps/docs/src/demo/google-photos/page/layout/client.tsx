"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { drill, hero, sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/google-photos";

const config: SsgoiConfig = {
  // Always preserve scroll inside the mobile-frame.
  preserveScroll: true,
  transitions: [
    {
      from: `${BASE}/collections`,
      to: `${BASE}/c/*`,
      transition: drill(),
    },
    // Collage maker rises as a sheet over the Create tab.
    {
      from: `${BASE}/create`,
      to: `${BASE}/collage`,
      transition: sheet(),
    },
    // Every detail screen has its own chrome (back button, meta) that the
    // surrounding tabs don't share, so cross-fade chrome on both pairs.
    // BASE↔c/* pair also gets generated but no UI flow triggers it.
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
    // No shared pathname boundary here: the `(tabs)` group brings its own
    // stable-key double boundary (MobileTabsShell) and `(detail)` brings a
    // per-route boundary (MobileDetailShell). A layout-level boundary would
    // remount the tab shell — bottom nav included — on every tab move.
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-white"
      withTransitionBoundary={false}
    >
      {children}
    </MobileShowcaseShell>
  );
}
