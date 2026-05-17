import { action, silent } from "comwit";
import { product } from "../model";
import type { ProductActions, ProductDetail } from "../types";

export const initActions = action<Pick<ProductActions, "init">>(({ state }) => {
  class InitActions {
    private model = state(product);
    init(detail: ProductDetail) {
      silent(() => {
        this.model.currentProduct = detail;
      });
    }
  }
  return new InitActions();
});
