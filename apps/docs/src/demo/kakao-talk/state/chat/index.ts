import { create } from "comwit";
import { chat } from "./model";
import { initActions } from "./actions/init";
import { loadActions } from "./actions/load";
import type { ChatState, ChatActions } from "./types";

export * from "./types";

export const useChat = create<ChatState, ChatActions>(chat, {
  actions: [initActions, loadActions],
});
