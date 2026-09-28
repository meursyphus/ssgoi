export interface ListingAPI {
  /** Explore feed for one vertical, grouped by section */
  findAll: (vertical?: ExploreVertical) => Promise<ListingFeed>;
  /** Single listing detail */
  find: (id: string) => Promise<ListingDetail>;
  /** Card data for the given ids, in the given order (unknown ids skipped) */
  findMany: (ids: string[]) => Promise<ListingSimple[]>;
  /** "See all" list behind an Explore row or a suggested destination */
  findCollection: (key: string) => Promise<ListingCollection>;
  /** Suggested destinations for the search sheet, filtered by the typed text */
  findDestinations: (query: string) => Promise<Destination[]>;
}

export type ExploreVertical = "homes" | "experiences" | "services";

export type ListingFeed = {
  vertical: ExploreVertical;
  sections: FeedSection[];
};

export type FeedSection = {
  /** Collection key the section header opens */
  key: string;
  title: string;
  /** "row" = horizontal carousel of small cards, "grid" = 2-column cards */
  layout: "row" | "grid";
  items: ListingSimple[];
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

export type ListingCollection = {
  key: string;
  title: string;
  /** Pre-formatted, e.g. "3 homes" */
  subtitle: string;
  items: ListingSimple[];
};

export type Destination = {
  /** Collection key this destination opens */
  key: string;
  title: string;
  subtitle: string;
  thumbnail: string;
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
  perks: {
    label: string;
    description: string;
    /** Button label, e.g. "Add 1 night" */
    actionLabel: string;
    /** Shown once the perk is added, e.g. "1 night added · Total ₩174,000" */
    addedLabel: string;
  };
  /** Numeric price used in checkout summary */
  priceKRW: number;
  /** Pre-formatted price breakdown rows for the checkout "Details" */
  priceBreakdown: Array<{ label: string; amount: string }>;
  /** Alternative stays of the same length for the checkout "Change" dates */
  dateOptions: string[];
  /** Pre-formatted payment plan labels */
  payPlans: { full: string; split: string; splitNote: string };
  /** Refund policy one-liner */
  refundLabel: string;
};
