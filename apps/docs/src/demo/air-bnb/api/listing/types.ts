export interface ListingAPI {
  /** Home feed grouped by section */
  findAll: () => Promise<ListingFeed>;
  /** Single listing detail */
  find: (id: string) => Promise<ListingDetail>;
}

export type ListingFeed = {
  recent: ListingSimple[];
  popular: ListingSimple[];
};

export type ListingSimple = {
  id: string;
  title: string;
  thumbnail: string;
  /** Short region label shown on cards, e.g. "Seoul" */
  region: string;
  bedroomLabel: string;
  rating: number;
  /** Pre-formatted price string for cards, e.g. "Total ₩125,000" */
  priceLabel: string;
  /** Pre-formatted date label, e.g. "Jun 12 – 14" */
  dateLabel: string;
  /** Highlighted badge (e.g. "Guest favourite"). Undefined hides it. */
  badge?: string;
};

export type ListingDetail = ListingSimple & {
  /** Gallery — first image is the hero */
  images: string[];
  /** Location subtitle, e.g. "Room in Seoul, South Korea" */
  locationDesc: string;
  /** Facility one-liner, e.g. "12 bunk beds · 3 shared bathrooms" */
  facilityLabel: string;
  reviewCount: number;
  amenities: Array<{
    icon: "coffee" | "laundry" | "wifi" | "tv";
    label: string;
  }>;
  perks: { label: string; description: string };
  /** Numeric price used in checkout summary */
  priceKRW: number;
  /** Refund policy one-liner */
  refundLabel: string;
};
