import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { ListingDetail } from "../types";

async function _find(id: string): Promise<ListingDetail> {
  const listing = data.byId(id);
  if (!listing) throw new ActionError("숙소를 찾을 수 없습니다");
  return listing;
}

export const find = createAction(_find);
