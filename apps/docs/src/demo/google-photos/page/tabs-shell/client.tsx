"use client";

import type { ReactNode } from "react";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { TopAppBar } from "../shared/top-app-bar";
import { FloatingBottomNav } from "../shared/floating-bottom-nav";

export function GooglePhotosTabsShell({ children }: { children: ReactNode }) {
  return (
    <MobileTabsShell
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
