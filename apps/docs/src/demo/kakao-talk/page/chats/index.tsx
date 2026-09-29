"use client";

import { useEffect } from "react";
import { useChat } from "@/demo/kakao-talk/state/chat";
import { ChatsHeader } from "./chats-header";
import { AdBanner } from "./ad-banner";
import { ThreadList } from "./thread-list";
export default function ChatsPage() {
  const chat = useChat((state) => ({
    threads: state.threads,
    threadFilter: state.threadFilter,
    actions: state.actions,
  }));
  useEffect(() => {
    chat.actions.loadThreads();
  }, [chat.actions]);
  return (
    <div className="flex min-h-full flex-col bg-white">
      <ChatsHeader
        filter={chat.threadFilter}
        onFilterChange={(f) => chat.actions.setThreadFilter(f)}
      />
      <div className="flex-1 overflow-y-auto pb-16">
        <AdBanner />
        <ThreadList
          key={chat.threadFilter}
          pinned={chat.threads.data.pinned}
          recent={chat.threads.data.recent}
          isLoading={chat.threads.isLoading}
          emptyLabel={
            chat.threadFilter === "unread" ? "안 읽은 채팅이 없어요" : undefined
          }
        />
      </div>
    </div>
  );
}
