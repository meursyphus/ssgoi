import { action } from "comwit";
import { cart } from "../model";
import type { CartActions, CartProductMeta } from "../types";

export const editActions = action<
  Pick<CartActions, "add" | "subtract" | "clear">
>(({ state }) => {
  class EditActions {
    private model = state(cart);

    add(meta: CartProductMeta) {
      const found = this.model.items.find((i) => i.productId === meta.id);
      if (found) {
        found.quantity += 1;
      } else {
        this.model.items.push({ productId: meta.id, quantity: 1 });
      }
    }

    subtract(productId: string) {
      const idx = this.model.items.findIndex((i) => i.productId === productId);
      if (idx < 0) return;
      const item = this.model.items[idx];
      if (item.quantity <= 1) {
        this.model.items.splice(idx, 1);
      } else {
        item.quantity -= 1;
      }
    }

    clear() {
      this.model.items = [];
    }
  }
  return new EditActions();
});
