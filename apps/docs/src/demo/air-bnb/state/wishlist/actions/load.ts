import { action } from "comwit";
import { wishlist } from "../model";
import type { WishlistActions } from "../types";

export const loadActions = action<Pick<WishlistActions, "load" | "loadSaved">>(
  ({ state }) => {
    class LoadActions {
      private model = state(wishlist);
      async load() {
        await this.model.overview.query();
      }
      async loadSaved() {
        await this.model.saved.query();
      }
    }
    return new LoadActions();
  },
);
