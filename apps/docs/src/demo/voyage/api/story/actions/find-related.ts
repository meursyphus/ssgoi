import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { StorySimple } from "../types";

async function _findRelated(id: string): Promise<StorySimple[]> {
  return data.related(id);
}

export const findRelated = createAction(_findRelated);
