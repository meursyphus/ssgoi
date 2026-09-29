"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import {
  useProfile,
  type Follows,
  type FollowTab,
  type ProfileMe,
} from "@/demo/instagram/state/profile";
import { FollowsHeader } from "./header";
import { FollowsTabs } from "./tabs";
import { FollowsSearch } from "./search";
import { UserRow } from "./user-row";

const SECTION: Record<FollowTab, string> = {
  followers: "모든 팔로워",
  following: "팔로잉 중인 계정",
};

export default function FollowsPage({
  initialTab,
  me,
  initialData,
}: {
  initialTab: FollowTab;
  me: ProfileMe;
  initialData: Follows;
}) {
  const profile = useProfile((state) => ({
    actions: state.actions,
  }));
  profile.actions.initFollows(initialData);
  // 탭 전환은 화면 안에서 — URL push면 drill이 한 번 더 걸린다
  const [tab, setTab] = useState<FollowTab>(initialTab);
  const [switched, setSwitched] = useState(false);
  const users = initialData[tab];
  const changeTab = (next: FollowTab) => {
    setTab(next);
    setSwitched(true);
  };
  return (
    <SsgoiRouteBoundary className="relative block min-h-full w-full bg-white text-neutral-900">
      <div className="sticky top-0 z-20 bg-white">
        <FollowsHeader
          username={me.username}
          fallbackHref={`/demo/instagram/profile/${me.username}`}
        />
        <FollowsTabs
          tab={tab}
          followersLabel={me.followersLabel}
          followingLabel={me.followingLabel}
          onChange={changeTab}
        />
      </div>
      <FollowsSearch />
      <motion.div
        key={tab}
        // 첫 진입은 drill이 담당 — 탭을 바꿀 때만 목록이 옆에서 들어온다
        initial={
          switched ? { opacity: 0, x: tab === "following" ? 24 : -24 } : false
        }
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="pb-10"
      >
        <p className="px-4 pb-1 pt-3 text-[14px] font-semibold">
          {SECTION[tab]}
        </p>
        {users.map((u) => (
          <UserRow key={u.id} user={u} />
        ))}
      </motion.div>
    </SsgoiRouteBoundary>
  );
}
