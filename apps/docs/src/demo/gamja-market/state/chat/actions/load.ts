import { action } from "comwit";
import { chat } from "../model";
import type { ChatActions } from "../types";

export const loadActions = action<Pick<ChatActions, "loadChats">>(
  ({ state }) => {
    class LoadActions {
      private model = state(chat);
      async loadChats() {
        await this.model.chats.query();
      }
    }
    return new LoadActions();
  },
);
