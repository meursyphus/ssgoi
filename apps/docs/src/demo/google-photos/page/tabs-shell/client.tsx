"use client";

import type { ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { axis } from "@ssgoi/react/view-transitions";
import { SsgoiTransitionBoundary } from "@/lib/components/ssgoi-transition-boundary";
import { TopAppBar } from "../shared/top-app-bar";
import { FloatingBottomNav } from "../shared/floating-bottom-nav";
const BASE = "/demo/google-photos";
const innerConfig: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    ...axis({
      paths: [BASE, `${BASE}/collections`, `${BASE}/create`],
      type: "y",
      variant: "non-directional",
    }),
  ],
};

// Keep the layout shell outside the transition boundary. Its flex/stacking
// context is stable chrome; only the routed tab page below it changes.
export function GooglePhotosTabsShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-col bg-white">
      <div className="sticky top-0 z-30 bg-white">
        <TopAppBar />
      </div>
      <Ssgoi config={innerConfig}>
        <div className="relative z-0 flex-1 bg-white">
          <SsgoiTransitionBoundary className="min-h-full bg-white">
            {children}
          </SsgoiTransitionBoundary>
        </div>
      </Ssgoi>
      <FloatingBottomNav />
    </div>
  );
}
