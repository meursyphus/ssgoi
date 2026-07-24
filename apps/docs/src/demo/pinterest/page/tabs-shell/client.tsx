"use client";

import type { ReactNode } from "react";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { BottomNav } from "../shared/bottom-nav";

export function PinterestTabsShell({ children }: { children: ReactNode }) {
  return <MobileTabsShell nav={<BottomNav />}>{children}</MobileTabsShell>;
}
