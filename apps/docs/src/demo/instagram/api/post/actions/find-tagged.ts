import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { TaggedPost } from "../types";

async function _findTagged(): Promise<TaggedPost[]> {
  return data.tagged();
}

export const findTagged = createAction(_findTagged);
