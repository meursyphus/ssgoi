import { createAction } from "@/lib/utils";
import { listing } from "@/demo/air-bnb/api/listing";
import { data } from "../data";
import type { WishlistOverview } from "../types";

async function _findAll(): Promise<WishlistOverview> {
  const savedIds = data.savedIds();
  const [recent, saved] = await Promise.all([
    listing.findCollection("recently-viewed"),
    listing.findMany(savedIds),
  ]);
  return {
    savedIds,
    lists: [
      {
        key: recent.key,
        title: recent.title,
        caption: "Today",
        covers: recent.items.slice(0, 4).map((l) => l.thumbnail),
      },
      {
        key: data.key,
        title: data.title,
        caption: saved.length ? `${saved.length} saved` : "Nothing saved yet",
        covers: saved.slice(0, 4).map((l) => l.thumbnail),
      },
    ],
  };
}

export const findAll = createAction(_findAll);
