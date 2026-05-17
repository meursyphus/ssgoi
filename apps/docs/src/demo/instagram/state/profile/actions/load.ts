import { action } from "comwit";
import { profile } from "../model";
import type { ProfileActions } from "../types";

export const loadActions = action<Pick<ProfileActions, "loadMe">>(
  ({ state }) => {
    class LoadActions {
      private model = state(profile);
      async loadMe() {
        await this.model.me.query();
      }
    }
    return new LoadActions();
  },
);
