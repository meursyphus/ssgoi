import type { Query } from "comwit";
import type { ChatRoomSimple } from "@/demo/gamja-market/api/chat";

export type ChatState = {
  chats: Query<ChatRoomSimple[], void>;
};

export type ChatActions = {
  loadChats(): Promise<void>;
};

export type { ChatRoomSimple };
