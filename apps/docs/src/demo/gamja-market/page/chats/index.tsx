"use client";

import { useEffect } from "react";
import { useChat } from "@/demo/gamja-market/state/chat";
import { TabHeader } from "@/demo/gamja-market/page/shared/tab-header";
import { ChatList } from "./chat-list";

export default function ChatsPage() {
  const chat = useChat((state) => ({ actions: state.actions }));
  useEffect(() => {
    chat.actions.loadChats();
  }, [chat.actions]);
  return (
    <div className="flex flex-1 flex-col bg-white">
      <TabHeader title="채팅" />
      <ChatList />
    </div>
  );
}
