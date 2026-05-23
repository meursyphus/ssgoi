import { action } from "comwit";
import { collection } from "../model";
import type { CollectionActions } from "../types";

export const loadActions = action<Pick<CollectionActions, "loadAll">>(
  ({ state }) => {
    class LoadActions {
      private model = state(collection);
      async loadAll() {
        await this.model.collections.query();
      }
    }
    return new LoadActions();
  },
);
