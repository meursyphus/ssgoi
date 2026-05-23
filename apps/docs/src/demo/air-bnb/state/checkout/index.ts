import { create } from "comwit";
import { checkout } from "./model";
import { flowActions } from "./actions/flow";
import type { CheckoutState, CheckoutActions } from "./types";

export * from "./types";

export const useCheckout = create<CheckoutState, CheckoutActions>(checkout, {
  actions: [flowActions],
});
