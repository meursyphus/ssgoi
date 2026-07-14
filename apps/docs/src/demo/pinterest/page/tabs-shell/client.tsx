"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { BottomNav } from "../shared/bottom-nav";

const BASE = "/demo/pinterest";

const tabsConfig: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    // Home ↔ Search — Pinterest swaps tabs with a quick, quiet cross-fade.
    fade({ paths: [BASE, `${BASE}/search`] }),
  ],
};

// Double-boundary tab shell — pattern docs live on MobileTabsShell.
export function PinterestTabsShell({ children }: { children: ReactNode }) {
  return (
    <MobileTabsShell config={tabsConfig} nav={<BottomNav />}>
      {children}
    </MobileTabsShell>
  );
}
