"use client";

import type { ReactNode } from "react";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { BottomNav } from "../shared/bottom-nav";
import { ShellOverlays } from "../shared/shell-overlays";

// Drawer + account card render in the shell (above the nav), not in a tab
// page whose boundary is its own stacking context below the nav.
export function MaterialMailTabsShell({ children }: { children: ReactNode }) {
  return (
    <MobileTabsShell
      className="bg-[#FAFAFE]"
      contentClassName="bg-[#FAFAFE]"
      topBar={<ShellOverlays />}
      nav={<BottomNav />}
    >
      {children}
    </MobileTabsShell>
  );
}
