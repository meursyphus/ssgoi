import { create } from "comwit";
import { product } from "./model";
import { initActions } from "./actions/init";
import { loadActions } from "./actions/load";
import type { ProductState, ProductActions } from "./types";

export * from "./types";

export const useProduct = create<ProductState, ProductActions>(product, {
  actions: [initActions, loadActions],
});
