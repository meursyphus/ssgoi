import type { ReactNode } from "react";
import { VoyageTabsShell } from "./client";

export default function TabsShell({ children }: { children: ReactNode }) {
  return <VoyageTabsShell>{children}</VoyageTabsShell>;
}
