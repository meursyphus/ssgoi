import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { StorySimple } from "../types";

async function _findSaved(): Promise<StorySimple[]> {
  return data.saved();
}

export const findSaved = createAction(_findSaved);
