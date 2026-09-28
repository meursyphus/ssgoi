import { createAction } from "@/lib/utils";
import { data, toSimple } from "../data";
import type { FriendList } from "../types";

async function _findPickable(): Promise<FriendList> {
  const items = data.sortedByName(data.all()).map(toSimple);
  return { label: `친구 ${items.length}`, items };
}

export const findPickable = createAction(_findPickable);
