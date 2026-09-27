"use client";

import type { ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { axis, drill, fade, hero, sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";

const BASE = "/demo/kakao-talk";

// One config owns tab, sheet, and drill rules. Boundaries decide which layout
// region leaves; the bottom nav stays mounted for tab-to-tab moves.
// Rules are ranked by priority → specificity → declaration order, so the
// explicit pairs below beat the broad chats/** drill scope.
const config: SsgoiConfig = {
  transitions: [
    // bottom-nav tabs — index order sets the slide direction
    {
      ordered: [BASE, `${BASE}/chats`, `${BASE}/more`],
      transition: axis({ type: "x", variant: "snappy" }),
    },
    // tab → search — swaps in place. A pair (not `on`) so search → profile
    // stays a sheet and search → room stays a drill.
    {
      from: [BASE, `${BASE}/chats`, `${BASE}/more`],
      to: `${BASE}/search`,
      transition: fade(),
    },
    // profile / 친구 추가 / 새 채팅 — sheet static (배경 가만, 시트만 올라옴).
    // Leaving a sheet for a room (1:1 채팅, 새 채팅 확인) drops the sheet.
    // Keep it declared before the chats/** drill rule.
    {
      on: [`${BASE}/profile/*`, `${BASE}/add-friend`, `${BASE}/new-chat`],
      transition: sheet({ type: "static" }),
    },
    // room ≡ → 채팅방 서랍 — explicit pair so a push back still drills out
    {
      from: `${BASE}/chats/*`,
      to: `${BASE}/chats/*/drawer`,
      transition: drill(),
    },
    // photo message (bubble or drawer thumbnail) → full-screen viewer
    {
      from: [`${BASE}/chats/*`, `${BASE}/chats/*/drawer`],
      to: `${BASE}/chats/*/photo/*`,
      transition: hero({ type: "fade" }),
    },
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
