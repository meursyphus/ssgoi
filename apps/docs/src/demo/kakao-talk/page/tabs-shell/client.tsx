"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { type SsgoiConfig } from "@ssgoi/react";
import { axis } from "@ssgoi/react/view-transitions";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { BottomTabBar } from "../shared/bottom-tab-bar";

const BASE = "/demo/kakao-talk";

const tabsConfig: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    // 친구 ↔ 채팅 — KakaoTalk-style snappy tab swap (tight 8px slide, ~160ms).
    ...axis({ paths: [BASE, `${BASE}/chats`], type: "x", variant: "snappy" }),
  ],
};

// Double-boundary tab shell — pattern docs live on MobileTabsShell. The bar
// is a full-width opaque strip, so it keeps its flow height and sticks to the
// viewport bottom as the column's last child.
export function KakaoTalkTabsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <MobileTabsShell
      config={tabsConfig}
      nav={
        <div className="sticky bottom-0 z-30">
          <BottomTabBar
            active={pathname === `${BASE}/chats` ? "chats" : "friends"}
          />
        </div>
      }
    >
      {children}
    </MobileTabsShell>
  );
}
