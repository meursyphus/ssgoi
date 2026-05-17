import { action } from "comwit";
import { chat } from "../model";
import type { ChatActions } from "../types";

export const loadActions = action<Pick<ChatActions, "loadThreads">>(
  ({ state }) => {
    class LoadActions {
      private model = state(chat);
      async loadThreads() {
        await this.model.threads.query();
      }
    }
    return new LoadActions();
  },
);
