import { action, silent } from "comwit";
import { chat } from "../model";
import type { ChatActions, ChatThreadDetail } from "../types";

export const initActions = action<Pick<ChatActions, "init">>(({ state }) => {
  class InitActions {
    private model = state(chat);
    init(detail: ChatThreadDetail) {
      silent(() => {
        this.model.currentThread = detail;
      });
    }
  }
  return new InitActions();
});
