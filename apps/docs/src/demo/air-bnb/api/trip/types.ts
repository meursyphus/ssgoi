export interface TripAPI {
  /** Trips tab: upcoming reservations and past stays (never the same id twice) */
  findAll: () => Promise<TripOverview>;
  /** Books the stay; it becomes the first upcoming reservation */
  book: (input: BookingInput) => Promise<void>;
}

export type BookingInput = {
  listingId: string;
  dateLabel: string;
  guestsLabel: string;
};

export type Trip = {
  /** Listing id — the card opens /listings/:id */
  id: string;
  title: string;
  region: string;
  /** e.g. "Hotel in Seoul, South Korea" */
  location: string;
  thumbnail: string;
  /** e.g. "Jun 26 – 28 · 1 guest" or "Jul 2 – 4, 2024" */
  dateLabel: string;
  /** Chip on upcoming cards, e.g. "Confirmed" */
  statusLabel?: string;
};

export type TripOverview = {
  upcoming: Trip[];
  past: Trip[];
};
