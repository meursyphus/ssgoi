import { createAction } from "@/lib/utils";
import { data, toSimple } from "../data";
import type { FriendList } from "../types";

async function _search(q: string): Promise<FriendList> {
  if (!q.trim()) {
    const favorites = data
      .all()
      .filter((f) => data.favoriteIds.includes(f.id))
      .map(toSimple);
    return { label: "즐겨찾는 친구", items: favorites };
  }
  const items = data.search(q).map(toSimple);
  return { label: `친구 ${items.length}`, items };
}

export const search = createAction(_search);
