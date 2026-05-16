import type { Query } from "comwit";
import type { RecommendedCategory } from "@/demo/pinterest/api/category";

export type CategoryState = {
  categories: Query<RecommendedCategory[], void>;
};

export type CategoryActions = {
  loadCategories(): Promise<void>;
};

export type { RecommendedCategory };
