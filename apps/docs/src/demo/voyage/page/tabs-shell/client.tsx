"use client";

import type { ReactNode } from "react";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { BottomNav } from "./bottom-nav";

export function VoyageTabsShell({ children }: { children: ReactNode }) {
  return <MobileTabsShell nav={<BottomNav />}>{children}</MobileTabsShell>;
}
