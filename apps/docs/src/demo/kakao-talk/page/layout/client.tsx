"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { axis, drill, sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/kakao-talk";

// One config owns tab, sheet, and drill rules. Boundaries decide which layout
// region leaves; the bottom nav stays mounted for tab-to-tab moves.
const config: SsgoiConfig = {
  transitions: [
    {
      ordered: [BASE, `${BASE}/chats`],
      transition: axis({ type: "x", variant: "snappy" }),
    },
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
    // The (tabs)/(detail) route-group layouts own their boundaries.
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-white"
      withTransitionBoundary={false}
    >
      {children}
    </MobileShowcaseShell>
  );
}
