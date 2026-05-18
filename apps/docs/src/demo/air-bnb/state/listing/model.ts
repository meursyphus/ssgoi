import { model, query, keepPreviousData } from "comwit";
import { listing as listingAPI } from "@/demo/air-bnb/api/listing";
import type { ListingState } from "./types";

export const listing = model<ListingState>({
  feed: query<ListingState["feed"]["data"], void>({
    initialData: { recent: [], popular: [] },
    queryFn: () => listingAPI.findAll(),
    placeholderData: keepPreviousData,
  }),
  currentListing: null,
});
