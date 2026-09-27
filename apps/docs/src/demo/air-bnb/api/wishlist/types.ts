import type { ListingCollection } from "@/demo/air-bnb/api/listing";

export interface WishlistAPI {
  /** Wishlists tab: one card per list, plus the ids behind every heart */
  findAll: () => Promise<WishlistOverview>;
  /** The saved wishlist, shaped like any other collection page */
  findSaved: () => Promise<ListingCollection>;
  /** Saves or removes a listing; returns the snackbar copy */
  toggle: (listingId: string) => Promise<WishlistToggleResult>;
}

export type WishlistSummary = {
  /** Collection key the card opens */
  key: string;
  title: string;
  /** e.g. "Today" or "2 saved" */
  caption: string;
  /** Up to four thumbnails for the collage */
  covers: string[];
};

export type WishlistOverview = {
  lists: WishlistSummary[];
  savedIds: string[];
};

export type WishlistToggleResult = {
  saved: boolean;
  message: string;
};
