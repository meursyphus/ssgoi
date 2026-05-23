import type { ReactNode } from "react";
import { GooglePhotosTabsShell } from "./client";

export default function TabsShell({ children }: { children: ReactNode }) {
  return <GooglePhotosTabsShell>{children}</GooglePhotosTabsShell>;
}
