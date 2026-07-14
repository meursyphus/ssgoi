"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { type SsgoiConfig } from "@ssgoi/react";
import { axis } from "@ssgoi/react/view-transitions";
import { SsgoiWithHost } from "@/lib/components/demo-shell";
import { SsgoiTransitionBoundary } from "@/lib/components/ssgoi-transition-boundary";
import { BottomTabBar } from "../shared/bottom-tab-bar";

const BASE = "/demo/kakao-talk";

const tabsConfig: SsgoiConfig = {
  preserveScroll: true,
  transitions: [
    // 친구 ↔ 채팅 — KakaoTalk-style snappy tab swap (tight 8px slide, ~160ms).
    ...axis({ paths: [BASE, `${BASE}/chats`], type: "x", variant: "snappy" }),
  ],
};

/**
 * Double-boundary tab shell — same pattern as google-photos' tabs-shell
 * (see that file for the full explanation): a stable-key outer boundary owns
 * the shell so tab↔tab never remounts it (tab bar stands still while the
 * nested provider runs `axis` on the content), and on tab→detail the whole
 * shell unmounts so the outer drill/sheet carries the tab bar out with the
 * page. The bar is a full-width opaque strip, so it keeps its flow height and
 * sticks to the viewport bottom as the column's last child.
 */
export function KakaoTalkTabsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <SsgoiTransitionBoundary
      stableKey
      className="relative flex min-h-full flex-col bg-white"
    >
      <SsgoiWithHost config={tabsConfig} withTransitionBoundary={false}>
        <div className="relative z-0 flex-1">
          <SsgoiTransitionBoundary className="min-h-full bg-white">
            {children}
          </SsgoiTransitionBoundary>
        </div>
      </SsgoiWithHost>
      <div className="sticky bottom-0 z-30">
        <BottomTabBar
          active={pathname === `${BASE}/chats` ? "chats" : "friends"}
        />
      </div>
    </SsgoiTransitionBoundary>
  );
}
