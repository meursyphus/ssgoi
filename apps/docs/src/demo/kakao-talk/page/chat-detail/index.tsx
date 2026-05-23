"use client";

import { SsgoiTransition } from "@ssgoi/react";
import { useChat, type ChatThreadDetail } from "@/demo/kakao-talk/state/chat";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { Composer } from "./composer";

export default function ChatDetailPage({
  initialData,
}: {
  initialData: ChatThreadDetail;
}) {
  const chat = useChat((state) => ({ actions: state.actions }));
  chat.actions.init(initialData);

  return (
    <SsgoiTransition
      id={`/demo/kakao-talk/chats/${initialData.id}`}
      className="flex min-h-full flex-col bg-[#A4BFD2]"
    >
      <ChatHeader thread={initialData} />
      <MessageList messages={initialData.messages} />
      <Composer />
    </SsgoiTransition>
  );
}
