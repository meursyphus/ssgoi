"use client";

import { Loader2 } from "lucide-react";
import { useChat } from "@/demo/gamja-market/state/chat";
import { ChatRow } from "./chat-row";

export function ChatList() {
  const chat = useChat((state) => ({ chats: state.chats }));

  if (!chat.chats.isSuccess) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {chat.chats.data.map((room) => (
        <li key={room.id}>
          <ChatRow room={room} />
        </li>
      ))}
    </ul>
  );
}
