"use client";

import { useChat, type ChatThreadDetail } from "@/demo/kakao-talk/state/chat";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { Composer } from "./composer";
export default function ChatDetailPage({
  initialData,
}: {
  initialData: ChatThreadDetail;
}) {
  const chat = useChat((state) => ({
    actions: state.actions,
  }));
  chat.actions.init(initialData);
  return (
    <div className="flex min-h-full flex-col bg-[#A4BFD2]">
      <ChatHeader thread={initialData} />
      <MessageList messages={initialData.messages} />
      <Composer />
    </div>
  );
}
