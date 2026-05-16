import { create } from "comwit";
import { category } from "./model";
import { loadActions } from "./actions/load";
import type { CategoryState, CategoryActions } from "./types";

export * from "./types";

export const useCategory = create<CategoryState, CategoryActions>(category, {
  actions: [loadActions],
});
