import { action } from "comwit";
import { product } from "../model";
import type { ProductActions } from "../types";

export const loadActions = action<Pick<ProductActions, "loadProducts">>(
  ({ state }) => {
    class LoadActions {
      private model = state(product);
      async loadProducts() {
        await this.model.products.query();
      }
    }
    return new LoadActions();
  },
);
