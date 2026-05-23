import { action, silent } from "comwit";
import { collection } from "../model";
import type { CollectionActions, CollectionDetail } from "../types";

export const initActions = action<Pick<CollectionActions, "init">>(
  ({ state }) => {
    class InitActions {
      private model = state(collection);
      init(detail: CollectionDetail) {
        silent(() => {
          this.model.currentCollection = detail;
        });
      }
    }
    return new InitActions();
  },
);
