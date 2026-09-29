"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { BASE } from "../../mock-data";
import { ActionSheetHost } from "../shared/action-sheet";
import { YouTubeBottomNav } from "../shared/bottom-nav";

export function YouTubeMobileTabsShell({ children }: { children: ReactNode }) {
  const dark = usePathname() === `${BASE}/shorts`;

  return (
    <MobileTabsShell
      nav={
        <>
          <YouTubeBottomNav />
          <ActionSheetHost />
        </>
      }
      className="bg-white"
      contentClassName={dark ? "bg-[#0f0f0f]" : "bg-white"}
    >
      {children}
    </MobileTabsShell>
  );
}
