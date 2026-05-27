import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { RecommendedCategory } from "../types";

async function _findAll(): Promise<RecommendedCategory[]> {
  return data.all();
}

export const findAll = createAction(_findAll);
