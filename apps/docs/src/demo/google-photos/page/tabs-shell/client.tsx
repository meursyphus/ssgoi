"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { axis } from "@ssgoi/react/view-transitions";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { TopAppBar } from "../shared/top-app-bar";
import { FloatingBottomNav } from "../shared/floating-bottom-nav";

const BASE = "/demo/google-photos";

const tabsConfig: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    {
      ordered: [BASE, `${BASE}/collections`, `${BASE}/create`],
      transition: axis({ type: "y", variant: "non-directional" }),
    },
  ],
};

// Double-boundary tab shell — pattern docs live on MobileTabsShell. Here we
// only supply what's Google-Photos-specific: the tab axis config, the sticky
// top app bar, and the floating pill nav.
export function GooglePhotosTabsShell({ children }: { children: ReactNode }) {
  return (
    <MobileTabsShell
      config={tabsConfig}
      topBar={
        <div className="sticky top-0 z-30 bg-white">
          <TopAppBar />
        </div>
      }
      nav={<FloatingBottomNav />}
    >
      {children}
    </MobileTabsShell>
  );
}
