import type { ReactNode } from "react";
import { PinterestTabsShell } from "./client";

export default function TabsShell({ children }: { children: ReactNode }) {
  return <PinterestTabsShell>{children}</PinterestTabsShell>;
}
