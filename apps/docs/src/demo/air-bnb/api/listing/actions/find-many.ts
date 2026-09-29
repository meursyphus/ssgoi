import { createAction } from "@/lib/utils";
import { data } from "../data";
import { toSimple } from "../mapper";
import type { ListingSimple } from "../types";

async function _findMany(ids: string[]): Promise<ListingSimple[]> {
  return data.byIds(ids).map(toSimple);
}

export const findMany = createAction(_findMany);
