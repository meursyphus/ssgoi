"use client";

import { useEffect, useState } from "react";
import { useFriend } from "@/demo/kakao-talk/state/friend";
import { NewChatHeader } from "./new-chat-header";
import { FriendPicker } from "./friend-picker";

export default function NewChatPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const friend = useFriend((state) => ({
    pickable: state.pickable,
    actions: state.actions,
  }));
  useEffect(() => {
    friend.actions.loadPickable();
  }, [friend.actions]);

  const toggle = (id: string) =>
    setSelected((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );

  return (
    <div className="flex min-h-full flex-col bg-white">
      <NewChatHeader selectedIds={selected} />
      <FriendPicker
        list={friend.pickable.data}
        isLoading={friend.pickable.isLoading}
        selectedIds={selected}
        onToggle={toggle}
      />
    </div>
  );
}
