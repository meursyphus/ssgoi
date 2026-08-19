import type { ReactNode } from "react";
import { YouTubeMobileTabsShell } from "./client";

export default function TabsShell({ children }: { children: ReactNode }) {
  return <YouTubeMobileTabsShell>{children}</YouTubeMobileTabsShell>;
}
