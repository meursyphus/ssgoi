"use client";

import { useEffect, useState } from "react";
import { useFriend } from "@/demo/kakao-talk/state/friend";
import { AddFriendHeader } from "./add-friend-header";
import { RecommendedList } from "./recommended-list";

export default function AddFriendPage() {
  const [q, setQ] = useState("");
  const friend = useFriend((state) => ({
    recommended: state.recommended,
    addedIds: state.addedIds,
    actions: state.actions,
  }));

  useEffect(() => {
    friend.actions.loadRecommended(q);
  }, [q, friend.actions]);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AddFriendHeader value={q} onChange={setQ} />
      <RecommendedList
        list={friend.recommended.data}
        isLoading={friend.recommended.isLoading}
        addedIds={friend.addedIds}
        onToggle={(id) => friend.actions.toggleAdded(id)}
        query={q}
      />
    </div>
  );
}
