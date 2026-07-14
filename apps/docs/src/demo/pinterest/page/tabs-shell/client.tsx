"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";
import { SsgoiWithHost } from "@/lib/components/demo-shell";
import { SsgoiTransitionBoundary } from "@/lib/components/ssgoi-transition-boundary";
import { BottomNav } from "../shared/bottom-nav";

const BASE = "/demo/pinterest";

const tabsConfig: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    // Home ↔ Search — Pinterest swaps tabs with a quick, quiet cross-fade.
    fade({ paths: [BASE, `${BASE}/search`] }),
  ],
};

/**
 * Double-boundary tab shell — same pattern as google-photos' tabs-shell (see
 * that file for the full explanation). Home↔Search cross-fades inside the
 * nested provider while the bottom nav stands still; entering a pin or a
 * search result unmounts the whole shell, so the outer zoom/drill carries the
 * nav out with the page and detail screens are nav-free.
 */
export function PinterestTabsShell({ children }: { children: ReactNode }) {
  return (
    <SsgoiTransitionBoundary
      stableKey
      className="relative flex min-h-full flex-col bg-white"
    >
      <SsgoiWithHost config={tabsConfig} withTransitionBoundary={false}>
        <div className="relative z-0 flex-1">
          <SsgoiTransitionBoundary className="min-h-full bg-white">
            {children}
          </SsgoiTransitionBoundary>
        </div>
      </SsgoiWithHost>
      <BottomNav />
    </SsgoiTransitionBoundary>
  );
}
