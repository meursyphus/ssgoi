import { action } from "comwit";
import { friend } from "../model";
import type { FriendActions, FriendSort, HomeSegment } from "../types";

export const loadActions = action<
  Pick<
    FriendActions,
    | "loadGroups"
    | "setSort"
    | "setSegment"
    | "loadNews"
    | "search"
    | "loadRecommended"
    | "loadPickable"
  >
>(({ state }) => {
  class LoadActions {
    private model = state(friend);
    async loadGroups() {
      await this.model.groups.query(this.model.friendSort);
    }
    async setSort(sort: FriendSort) {
      if (this.model.friendSort === sort) return;
      this.model.friendSort = sort;
      await this.model.groups.query(sort);
    }
    async setSegment(segment: HomeSegment) {
      this.model.homeSegment = segment;
      if (segment === "news") await this.model.news.query();
    }
    async loadNews() {
      await this.model.news.query();
    }
    async search(q: string) {
      await this.model.searchResult.query(q);
    }
    async loadRecommended(q: string) {
      await this.model.recommended.query(q);
    }
    async loadPickable() {
      await this.model.pickable.query();
    }
  }
  return new LoadActions();
});
