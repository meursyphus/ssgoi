"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { type SsgoiConfig } from "@ssgoi/react";
import { axis, drill, sheet } from "@ssgoi/react/view-transitions";
import { MobileShowcaseShell } from "@/lib/components/mobile-showcase-shell";
import { BottomTabBar } from "../shared/bottom-tab-bar";

const BASE = "/demo/kakao-talk";

const config: SsgoiConfig = {
  // mobile-frame 안에서 항상 스크롤 보존
  preserveScroll: true,
  transitions: [
    // home (친구 탭) ↔ chats (채팅 탭) — tab transition
    // KakaoTalk-style: snappy feel (tight 8 px slide + cross-fade, ~160 ms).
    ...axis({ paths: [BASE, `${BASE}/chats`], type: "x", variant: "snappy" }),

    // home / chats → profile detail — sheet static (배경 가만, 시트만 올라옴)
    ...sheet({ type: "static", enter: `${BASE}/profile/*`, exit: BASE }),
    ...sheet({
      type: "static",
      enter: `${BASE}/profile/*`,
      exit: `${BASE}/chats`,
    }),

    // chats → chat detail — drill
    ...drill({ enter: `${BASE}/chats/*`, exit: `${BASE}/chats` }),
  ],
};

/**
 * 바텀 탭은 페이지 트랜지션 대상이 아니어야 하므로 layout 레벨에서 렌더.
 * tab path(home/chats)일 때만 보이고 detail 화면(profile/chat)에선 숨김.
 */
function BottomTabSlot() {
  const pathname = usePathname();
  if (pathname === BASE) return <BottomTabBar active="friends" />;
  if (pathname === `${BASE}/chats`) return <BottomTabBar active="chats" />;
  return null;
}

export function KakaoTalkLayoutClient({ children }: { children: ReactNode }) {
  return (
    <MobileShowcaseShell
      config={config}
      contentClassName="bg-white"
      bottomSlot={<BottomTabSlot />}
    >
      {children}
    </MobileShowcaseShell>
  );
}
