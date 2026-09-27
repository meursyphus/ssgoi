import type { Query } from "comwit";
import type { ListingCollection } from "@/demo/air-bnb/api/listing";
import type { WishlistOverview } from "@/demo/air-bnb/api/wishlist";

export type WishlistState = {
  overview: Query<WishlistOverview, void>;
  saved: Query<ListingCollection, void>;
};

export type WishlistActions = {
  load(): Promise<void>;
  loadSaved(): Promise<void>;
  /** Heart tap: save or remove, then show the snackbar */
  toggle(listingId: string): Promise<void>;
};

export type {
  WishlistOverview,
  WishlistSummary,
} from "@/demo/air-bnb/api/wishlist";
