"use client";

import { useEffect, useState } from "react";
import { useFriend } from "@/demo/kakao-talk/state/friend";
import { useChat } from "@/demo/kakao-talk/state/chat";
import { SearchHeader } from "./search-header";
import { FriendResults } from "./friend-results";
import { RoomResults } from "./room-results";

export default function SearchPage() {
  const friend = useFriend((state) => ({
    result: state.searchResult,
    searchText: state.searchText,
    actions: state.actions,
  }));
  // The input owns the text (keeps IME composition intact); the model keeps
  // a copy so coming back from a profile or room shows the same results.
  const [q, setQ] = useState(friend.searchText);
  const changeQuery = (value: string) => {
    setQ(value);
    friend.actions.setSearchText(value);
  };
  const chat = useChat((state) => ({
    result: state.threadSearch,
    actions: state.actions,
  }));

  useEffect(() => {
    friend.actions.search(q);
    chat.actions.searchThreads(q);
  }, [q, friend.actions, chat.actions]);

  const friends = friend.result.data;
  const rooms = chat.result.data;
  const settled = !friend.result.isLoading && !chat.result.isLoading;
  const noMatch =
    settled && q.trim() && friends.items.length + rooms.items.length === 0;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <SearchHeader value={q} onChange={changeQuery} />
      {noMatch ? (
        <p className="px-6 py-20 text-center text-[13px] leading-relaxed text-neutral-400">
          &lsquo;{q.trim()}&rsquo;에 대한 검색 결과가 없어요.
          <br />
          이름이나 채팅방 이름으로 다시 검색해 보세요.
        </p>
      ) : (
        <div className="pb-10">
          <FriendResults label={friends.label} items={friends.items} />
          <RoomResults label={rooms.label} items={rooms.items} />
        </div>
      )}
    </div>
  );
}
