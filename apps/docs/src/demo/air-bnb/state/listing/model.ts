import { model, query, keepPreviousData } from "comwit";
import {
  listing as listingAPI,
  type Destination,
  type ExploreVertical,
  type ListingFeed,
} from "@/demo/air-bnb/api/listing";
import type { ListingState } from "./types";

export const listing = model<ListingState>({
  feed: query<ListingFeed, ExploreVertical>({
    initialData: { vertical: "homes", sections: [] },
    queryFn: (vertical) => listingAPI.findAll(vertical),
    placeholderData: keepPreviousData,
  }),
  vertical: "homes",
  currentListing: null,
  collections: {},
  destinations: query<Destination[], string>({
    initialData: [],
    queryFn: (text) => listingAPI.findDestinations(text),
    placeholderData: keepPreviousData,
  }),
});
