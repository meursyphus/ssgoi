import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { Guide } from "../types";

async function _findGuides(query: string): Promise<Guide[]> {
  return data.guides(query);
}

export const findGuides = createAction(_findGuides);
