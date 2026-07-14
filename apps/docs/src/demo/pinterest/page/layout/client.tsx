"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { zoom, drill } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/pinterest";

const config: SsgoiConfig = {
  // 모바일 데모 — 데스크탑 viewport에서도 mobile-frame 안에서는 항상 스크롤 보존
  preserveScroll: true,
  transitions: [
    // home ↔ feed detail — zoom EXPAND (the headline interaction)
    zoom({
      paths: [BASE, `${BASE}/feed/*`],
      type: "expand",
    }),
    // search ↔ search result drill
    drill({
      enter: `${BASE}/search/*`,
      exit: `${BASE}/search`,
      type: "slide",
    }),
  ],
};

export function PinterestLayoutClient({ children }: { children: ReactNode }) {
  return (
    // Boundaries live in the (tabs)/(detail) group shells, not here — a
    // layout-level pathname boundary would remount the tab shell (bottom nav
    // included) on every Home↔Search move.
    <MobileShowcaseShell config={config} withTransitionBoundary={false}>
      {children}
    </MobileShowcaseShell>
  );
}
