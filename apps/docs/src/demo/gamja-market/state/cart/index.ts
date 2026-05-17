import { create } from "comwit";
import { cart } from "./model";
import { editActions } from "./actions/edit";
import { checkoutActions } from "./actions/checkout";
import type { CartState, CartActions } from "./types";

export * from "./types";

export const useCart = create<CartState, CartActions>(cart, {
  actions: [editActions, checkoutActions],
});
