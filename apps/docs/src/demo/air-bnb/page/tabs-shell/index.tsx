import type { ReactNode } from "react";
import { AirBnbTabsShell } from "./client";

export default function TabsShell({ children }: { children: ReactNode }) {
  return <AirBnbTabsShell>{children}</AirBnbTabsShell>;
}
