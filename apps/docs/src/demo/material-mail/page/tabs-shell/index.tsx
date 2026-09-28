import type { ReactNode } from "react";
import { MaterialMailTabsShell } from "./client";

export default function TabsShell({ children }: { children: ReactNode }) {
  return <MaterialMailTabsShell>{children}</MaterialMailTabsShell>;
}
