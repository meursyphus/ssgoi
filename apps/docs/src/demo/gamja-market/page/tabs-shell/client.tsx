"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { BottomNav, tabForPath } from "./bottom-nav";

export function GamjaMarketTabsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <MobileTabsShell
      className="bg-[#FAF8F6]"
      contentClassName="bg-[#FAF8F6]"
      nav={<BottomNav active={tabForPath(pathname)} />}
    >
      {children}
    </MobileTabsShell>
  );
}
