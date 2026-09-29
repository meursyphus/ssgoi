import { model } from "comwit";
import type { CheckoutState } from "./types";

export const MAX_GUESTS = 4;

export const checkout = model<CheckoutState>({
  selectedMethod: "card",
  dateLabel: null,
  guests: 1,
  payPlan: "full",
});
