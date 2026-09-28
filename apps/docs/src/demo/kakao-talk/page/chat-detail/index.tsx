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
    currentThread: state.currentThread,
    actions: state.actions,
  }));
  chat.actions.init(initialData);
  // Messages sent in this session live on the state copy of this room.
  const messages =
    chat.currentThread?.id === initialData.id
      ? chat.currentThread.messages
      : initialData.messages;
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#A4BFD2]">
      <ChatHeader thread={initialData} />
      <MessageList messages={messages} threadId={initialData.id} />
      <Composer />
    </div>
  );
}
