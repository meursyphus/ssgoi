import { action, silent } from "comwit";
import { listing } from "../model";
import type { ListingActions, ListingDetail } from "../types";

export const initActions = action<Pick<ListingActions, "init">>(({ state }) => {
  class InitActions {
    private model = state(listing);
    init(detail: ListingDetail) {
      silent(() => {
        this.model.currentListing = detail;
      });
    }
  }
  return new InitActions();
});
