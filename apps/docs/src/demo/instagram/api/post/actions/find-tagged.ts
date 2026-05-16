"use server";

import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { TaggedPost } from "../types";

async function _findTagged(): Promise<TaggedPost[]> {
  await new Promise((r) => setTimeout(r, 220));
  return data.tagged();
}

export const findTagged = createAction(_findTagged);
