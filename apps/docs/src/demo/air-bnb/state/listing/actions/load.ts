import { action } from "comwit";
import { listing } from "../model";
import type { ListingActions } from "../types";

export const loadActions = action<Pick<ListingActions, "loadFeed">>(
  ({ state }) => {
    class LoadActions {
      private model = state(listing);
      async loadFeed() {
        await this.model.feed.query();
      }
    }
    return new LoadActions();
  },
);
