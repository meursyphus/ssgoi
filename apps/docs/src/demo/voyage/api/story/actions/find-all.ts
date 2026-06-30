import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { StorySimple } from "../types";

async function _findAll(): Promise<StorySimple[]> {
  return data.all();
}

export const findAll = createAction(_findAll);
