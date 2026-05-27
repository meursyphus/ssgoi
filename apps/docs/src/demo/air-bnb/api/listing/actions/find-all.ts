import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { ListingFeed, ListingSimple } from "../types";

function toSimple({
  images: _images,
  locationDesc: _locationDesc,
  facilityLabel: _facilityLabel,
  reviewCount: _reviewCount,
  amenities: _amenities,
  perks: _perks,
  priceKRW: _priceKRW,
  refundLabel: _refundLabel,
  ...rest
}: ReturnType<typeof data.feed>["recent"][number]): ListingSimple {
  void _images;
  void _locationDesc;
  void _facilityLabel;
  void _reviewCount;
  void _amenities;
  void _perks;
  void _priceKRW;
  void _refundLabel;
  return rest;
}

async function _findAll(): Promise<ListingFeed> {
  const feed = data.feed();
  return {
    recent: feed.recent.map(toSimple),
    popular: feed.popular.map(toSimple),
  };
}

export const findAll = createAction(_findAll);
