import type { ReactNode } from "react";
import { KakaoTalkTabsShell } from "./client";

export default function TabsShell({ children }: { children: ReactNode }) {
  return <KakaoTalkTabsShell>{children}</KakaoTalkTabsShell>;
}
