import { action } from "comwit";
import { mail } from "../model";
import type { MailActions } from "../types";

export const searchActions = action<
  Pick<MailActions, "setSearchQuery" | "refreshResults" | "resetSearch">
>(({ state }) => {
  class SearchActions {
    private model = state(mail);
    async setSearchQuery(q: string) {
      this.model.searchQuery = q;
      await this.model.results.query(q, { force: true });
    }
    async refreshResults() {
      await this.model.results.query(this.model.searchQuery, { force: true });
    }
    resetSearch() {
      this.model.searchQuery = "";
      void this.model.results.query("", { force: true });
    }
  }
  return new SearchActions();
});
