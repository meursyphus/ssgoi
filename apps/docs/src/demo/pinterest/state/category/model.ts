import { model, query, keepPreviousData } from "comwit";
import { category as categoryAPI } from "@/demo/pinterest/api/category";
import type { CategoryState } from "./types";

export const category = model<CategoryState>({
  categories: query<CategoryState["categories"]["data"], void>({
    initialData: [],
    queryFn: () => categoryAPI.findAll(),
    placeholderData: keepPreviousData,
  }),
});
