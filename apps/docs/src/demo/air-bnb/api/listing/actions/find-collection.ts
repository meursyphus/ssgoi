import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import { toSimple } from "../mapper";
import type { ListingCollection } from "../types";

async function _findCollection(key: string): Promise<ListingCollection> {
  const collection = data.collection(key);
  if (!collection) throw new ActionError("목록을 찾을 수 없습니다");
  return { ...collection, items: collection.items.map(toSimple) };
}

export const findCollection = createAction(_findCollection);
