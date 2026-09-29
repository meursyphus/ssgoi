import { action } from "comwit";
import { listing } from "../model";
import type { ExploreVertical, ListingActions } from "../types";

export const loadActions = action<
  Pick<ListingActions, "loadFeed" | "selectVertical" | "searchDestinations">
>(({ state }) => {
  class LoadActions {
    private model = state(listing);
    async loadFeed() {
      await this.model.feed.query(this.model.vertical);
    }
    async selectVertical(vertical: ExploreVertical) {
      if (this.model.vertical === vertical) return;
      this.model.vertical = vertical;
      await this.model.feed.query(vertical);
    }
    async searchDestinations(text: string) {
      await this.model.destinations.query(text);
    }
  }
  return new LoadActions();
});
