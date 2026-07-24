"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { BottomTabBar } from "../shared/bottom-tab-bar";

const BASE = "/demo/kakao-talk";

export function KakaoTalkTabsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <MobileTabsShell
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
