import type { ReactNode } from "react";
import { GamjaMarketTabsShell } from "./client";

export default function TabsShell({ children }: { children: ReactNode }) {
  return <GamjaMarketTabsShell>{children}</GamjaMarketTabsShell>;
}
