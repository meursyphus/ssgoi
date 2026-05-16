import { action } from "comwit";
import { category } from "../model";
import type { CategoryActions } from "../types";

export const loadActions = action<Pick<CategoryActions, "loadCategories">>(
  ({ state }) => {
    class LoadActions {
      private model = state(category);
      async loadCategories() {
        await this.model.categories.query();
      }
    }
    return new LoadActions();
  },
);
