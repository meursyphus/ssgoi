import type { Query } from "comwit";
import type { ListingFeed, ListingDetail } from "@/demo/air-bnb/api/listing";

export type ListingState = {
  feed: Query<ListingFeed, void>;
  currentListing: ListingDetail | null;
};

export type ListingActions = {
  init(detail: ListingDetail): void;
  loadFeed(): Promise<void>;
};

export type { ListingFeed, ListingDetail };
export type { ListingSimple } from "@/demo/air-bnb/api/listing";
