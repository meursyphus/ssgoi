import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { PostDetail } from "../types";

async function _findFeed(): Promise<PostDetail[]> {
  return data.feed();
}

export const findFeed = createAction(_findFeed);
