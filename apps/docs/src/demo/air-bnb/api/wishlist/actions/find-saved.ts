import { createAction } from "@/lib/utils";
import { listing, type ListingCollection } from "@/demo/air-bnb/api/listing";
import { data } from "../data";

async function _findSaved(): Promise<ListingCollection> {
  const items = await listing.findMany(data.savedIds());
  return {
    key: data.key,
    title: data.title,
    subtitle: items.length ? `${items.length} saved` : "Nothing saved yet",
    items,
  };
}

export const findSaved = createAction(_findSaved);
