import { action } from "comwit";
import { chat } from "../model";
import type { ChatActions, ThreadFilterKey } from "../types";

export const loadActions = action<
  Pick<ChatActions, "loadThreads" | "setThreadFilter" | "searchThreads">
>(({ state }) => {
  class LoadActions {
    private model = state(chat);
    async loadThreads() {
      await this.model.threads.query(this.model.threadFilter);
    }
    async setThreadFilter(filter: ThreadFilterKey) {
      if (this.model.threadFilter === filter) return;
      this.model.threadFilter = filter;
      await this.model.threads.query(filter);
    }
    async searchThreads(q: string) {
      await this.model.threadSearch.query(q);
    }
  }
  return new LoadActions();
});
