import { action } from "comwit";
import { friend } from "../model";
import type { FriendActions } from "../types";

export const loadActions = action<Pick<FriendActions, "loadGroups">>(
  ({ state }) => {
    class LoadActions {
      private model = state(friend);
      async loadGroups() {
        await this.model.groups.query();
      }
    }
    return new LoadActions();
  },
);
