"use client";

import type { ReactNode } from "react";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { YouTubeBottomNav } from "../shared/bottom-nav";

export function YouTubeMobileTabsShell({ children }: { children: ReactNode }) {
  return (
    <MobileTabsShell
      nav={<YouTubeBottomNav />}
      className="bg-white"
      contentClassName="bg-white"
    >
      {children}
    </MobileTabsShell>
  );
}
