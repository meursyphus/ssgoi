import { action } from "comwit";
import { friend } from "../model";
import type { FriendActions } from "../types";

export const interactActions = action<
  Pick<FriendActions, "toggleAdded" | "setSearchText">
>(({ state }) => {
  class InteractActions {
    private model = state(friend);
    toggleAdded(id: string) {
      const i = this.model.addedIds.indexOf(id);
      if (i >= 0) this.model.addedIds.splice(i, 1);
      else this.model.addedIds.push(id);
    }
    setSearchText(q: string) {
      this.model.searchText = q;
    }
  }
  return new InteractActions();
});
