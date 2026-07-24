"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { drill, sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/kakao-talk";

// Outer provider — screen-level moves only. The 친구↔채팅 axis lives in the
// nested provider inside tabs-shell, which is also what keeps the bottom tab
// bar stationary on tab moves and lets it drill/sheet out on tab→detail.
const config: SsgoiConfig = {
  // mobile-frame 안에서 항상 스크롤 보존
  preserveScroll: true,
  transitions: [
    // home / chats → profile detail — sheet static (배경 가만, 시트만 올라옴)
    { on: `${BASE}/profile/*`, transition: sheet({ type: "static" }) },

    // chats → chat detail — drill
    {
      on: `${BASE}/chats/**`,
      except: `${BASE}/chats`,
      transition: drill(),
    },
  ],
};

export function KakaoTalkLayoutClient({ children }: { children: ReactNode }) {
  return (
    // Boundaries live in the (tabs)/(detail) group shells, not here — a
    // layout-level pathname boundary would remount the tab shell (bar
    // included) on every tab move.
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-white"
      withTransitionBoundary={false}
    >
      {children}
    </MobileShowcaseShell>
  );
}
