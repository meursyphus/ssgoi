"use client";

import { useEffect } from "react";
import { useFriend } from "@/demo/kakao-talk/state/friend";
import { MoreHeader } from "./more-header";
import { MyCard } from "./my-card";
import { ShortcutGrid } from "./shortcut-grid";

export default function MorePage() {
  const friend = useFriend((state) => ({
    groups: state.groups,
    actions: state.actions,
  }));
  useEffect(() => {
    friend.actions.loadGroups();
  }, [friend.actions]);
  return (
    <div className="flex min-h-full flex-col bg-white pb-16">
      <MoreHeader />
      <MyCard me={friend.groups.data.me} />
      <ShortcutGrid />
    </div>
  );
}
