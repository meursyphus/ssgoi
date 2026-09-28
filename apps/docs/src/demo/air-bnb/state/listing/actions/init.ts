import { action, silent } from "comwit";
import { listing } from "../model";
import type {
  ListingActions,
  ListingCollection,
  ListingDetail,
} from "../types";

export const initActions = action<
  Pick<ListingActions, "init" | "initCollection">
>(({ state }) => {
  class InitActions {
    private model = state(listing);
    init(detail: ListingDetail) {
      silent(() => {
        this.model.currentListing = detail;
      });
    }
    initCollection(collection: ListingCollection) {
      silent(() => {
        this.model.collections[collection.key] = collection;
      });
    }
  }
  return new InitActions();
});
