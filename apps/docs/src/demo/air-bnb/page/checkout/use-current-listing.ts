"use client";

import { useListing, type ListingDetail } from "@/demo/air-bnb/state/listing";

export function useCurrentListing(): ListingDetail {
  const detail = useListing((state) => state.currentListing);
  if (!detail) {
    throw new Error("Checkout listing is not initialized");
  }
  return detail;
}
