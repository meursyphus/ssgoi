"use client";

import type { ReactNode } from "react";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { BottomNav } from "../shared/bottom-nav";

/**
 * Explore, Wishlists, Trips, Messages and Profile: tab switches fade only the
 * content, and the nav leaves with the whole shell when a listing, search or
 * collection opens.
 */
export function AirBnbTabsShell({ children }: { children: ReactNode }) {
  return <MobileTabsShell nav={<BottomNav />}>{children}</MobileTabsShell>;
}
