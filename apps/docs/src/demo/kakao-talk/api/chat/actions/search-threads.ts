import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { ThreadSearchResult } from "../types";

async function _searchThreads(q: string): Promise<ThreadSearchResult> {
  const items = data.search(q);
  return {
    label: q.trim() ? `채팅방 ${items.length}` : "최근 대화",
    items,
  };
}

export const searchThreads = createAction(_searchThreads);
