import { model } from "comwit";
import type { CartState } from "./types";

export const cart = model<CartState>({
  items: [],
  isCheckingOut: false,
});
