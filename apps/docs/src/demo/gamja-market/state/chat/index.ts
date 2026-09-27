import { create } from "comwit";
import { chat } from "./model";
import { loadActions } from "./actions/load";
import type { ChatState, ChatActions } from "./types";

export * from "./types";

export const useChat = create<ChatState, ChatActions>(chat, {
  actions: [loadActions],
});
