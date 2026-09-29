import { model, query } from "comwit";
import type { ListingCollection } from "@/demo/air-bnb/api/listing";
import {
  wishlist as wishlistAPI,
  type WishlistOverview,
} from "@/demo/air-bnb/api/wishlist";
import type { WishlistState } from "./types";

export const wishlist = model<WishlistState>({
  overview: query<WishlistOverview, void>({
    initialData: { lists: [], savedIds: [] },
    queryFn: () => wishlistAPI.findAll(),
  }),
  saved: query<ListingCollection, void>({
    initialData: { key: "saved", title: "", subtitle: "", items: [] },
    queryFn: () => wishlistAPI.findSaved(),
  }),
});
