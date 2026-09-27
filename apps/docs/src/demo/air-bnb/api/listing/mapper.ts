import type { ListingDetail, ListingSimple } from "./types";

/** Card fields only — detail-page fields stay on the server response. */
export function toSimple(l: ListingDetail): ListingSimple {
  return {
    id: l.id,
    title: l.title,
    thumbnail: l.thumbnail,
    region: l.region,
    bedroomLabel: l.bedroomLabel,
    rating: l.rating,
    priceLabel: l.priceLabel,
    dateLabel: l.dateLabel,
    badge: l.badge,
  };
}
