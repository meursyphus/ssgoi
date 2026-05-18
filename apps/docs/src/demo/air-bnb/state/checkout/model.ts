import { model } from "comwit";
import type { CheckoutState } from "./types";

export const checkout = model<CheckoutState>({
  step: "review",
  selectedMethod: "card",
});
