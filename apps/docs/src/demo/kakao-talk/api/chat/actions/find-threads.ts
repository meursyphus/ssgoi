import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { ChatThreads, ThreadFilter } from "../types";

async function _findThreads(filter?: ThreadFilter): Promise<ChatThreads> {
  return {
    pinned: data.pinned(filter),
    recent: data.recent(filter),
  };
}

export const findThreads = createAction(_findThreads);
