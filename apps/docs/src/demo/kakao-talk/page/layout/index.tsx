import type { ReactNode } from "react";
import { KakaoTalkLayoutClient } from "./client";

export default function KakaoTalkLayout({ children }: { children: ReactNode }) {
  return <KakaoTalkLayoutClient>{children}</KakaoTalkLayoutClient>;
}
