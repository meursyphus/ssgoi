import { createAction } from "@/lib/utils";
import { data } from "../data";
import { toSimple } from "../mapper";
import type { ExploreVertical, ListingFeed } from "../types";

async function _findAll(
  vertical: ExploreVertical = "homes",
): Promise<ListingFeed> {
  return {
    vertical,
    sections: data.feed(vertical).map((section) => ({
      ...section,
      items: section.items.map(toSimple),
    })),
  };
}

export const findAll = createAction(_findAll);
