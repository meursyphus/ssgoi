import type { ReactNode } from "react";
import { KakaoTalkDetailShell } from "./client";

export default function DetailShell({ children }: { children: ReactNode }) {
  return <KakaoTalkDetailShell>{children}</KakaoTalkDetailShell>;
}
