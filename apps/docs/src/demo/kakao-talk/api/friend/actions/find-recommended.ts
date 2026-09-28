import { createAction } from "@/lib/utils";
import { data, toSimple } from "../data";
import type { FriendList } from "../types";

async function _findRecommended(q: string): Promise<FriendList> {
  const items = data.recommended(q).map(toSimple);
  return {
    label: q.trim() ? `검색 결과 ${items.length}` : "알 수도 있는 친구",
    items,
  };
}

export const findRecommended = createAction(_findRecommended);
