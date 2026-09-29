import type { Query } from "comwit";
import type {
  Destination,
  ExploreVertical,
  ListingCollection,
  ListingDetail,
  ListingFeed,
} from "@/demo/air-bnb/api/listing";

export type ListingState = {
  feed: Query<ListingFeed, ExploreVertical>;
  /** Explore category tab (Homes / Experiences / Services) */
  vertical: ExploreVertical;
  currentListing: ListingDetail | null;
  /** Server-rendered "see all" lists, by key */
  collections: Record<string, ListingCollection>;
  destinations: Query<Destination[], string>;
};

export type ListingActions = {
  init(detail: ListingDetail): void;
  initCollection(collection: ListingCollection): void;
  loadFeed(): Promise<void>;
  selectVertical(vertical: ExploreVertical): Promise<void>;
  searchDestinations(query: string): Promise<void>;
};

export type {
  Destination,
  ExploreVertical,
  FeedSection,
  ListingCollection,
  ListingDetail,
  ListingFeed,
  ListingSimple,
} from "@/demo/air-bnb/api/listing";
