import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { PostSimple } from "../types";

async function _findExplore(): Promise<PostSimple[]> {
  return data.explore();
}

export const findExplore = createAction(_findExplore);
