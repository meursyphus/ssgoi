"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useFriend, type HomeSegment } from "@/demo/kakao-talk/state/friend";
import { TopHeader } from "./top-header";
import { FriendsSegment } from "./friends-segment";
import { NewsGrid } from "./news-grid";

export default function HomePage() {
  const friend = useFriend((state) => ({
    groups: state.groups,
    news: state.news,
    homeSegment: state.homeSegment,
    actions: state.actions,
  }));
  // Fade only after a pill tap — not when the tab mounts mid-transition.
  const [switched, setSwitched] = useState(false);

  useEffect(() => {
    friend.actions.loadGroups();
  }, [friend.actions]);

  const selectSegment = (segment: HomeSegment) => {
    if (segment === friend.homeSegment) return;
    setSwitched(true);
    friend.actions.setSegment(segment);
  };

  return (
    <div className="flex min-h-full flex-col bg-white">
      <TopHeader
        me={friend.groups.data.me}
        activeTab={friend.homeSegment}
        onTabChange={selectSegment}
      />
      <motion.div
        key={friend.homeSegment}
        initial={switched ? { opacity: 0, y: 6 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex-1 pb-16"
      >
        {friend.homeSegment === "news" ? (
          <NewsGrid news={friend.news.data} isLoading={friend.news.isLoading} />
        ) : (
          <FriendsSegment groups={friend.groups.data} />
        )}
      </motion.div>
    </div>
  );
}
