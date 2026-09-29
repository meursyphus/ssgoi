"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MobileTabsShell } from "@/lib/components/mobile-tabs-shell";
import { useFriend } from "@/demo/kakao-talk/state/friend";
import { BottomTabBar } from "../shared/bottom-tab-bar";

const BASE = "/demo/kakao-talk";

const ACTIVE_BY_PATH: Record<string, "friends" | "chats" | "more"> = {
  [`${BASE}/chats`]: "chats",
  [`${BASE}/more`]: "more",
};

export function KakaoTalkTabsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const friend = useFriend((state) => ({ actions: state.actions }));

  // Back on a tab ends the search: the next search starts empty. Search →
  // profile/room → back never mounts the tabs, so that keeps the query.
  useEffect(() => {
    friend.actions.setSearchText("");
  }, [friend.actions]);

  return (
    <MobileTabsShell
      nav={
        <div className="sticky bottom-0 z-30">
          <BottomTabBar active={ACTIVE_BY_PATH[pathname] ?? "friends"} />
        </div>
      }
    >
      {children}
    </MobileTabsShell>
  );
}
