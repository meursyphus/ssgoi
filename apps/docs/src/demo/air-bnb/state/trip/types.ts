import type { Query } from "comwit";
import type { TripOverview } from "@/demo/air-bnb/api/trip";

export type TripState = {
  trips: Query<TripOverview, void>;
};

export type TripActions = {
  load(): Promise<void>;
  /** Books the listing open in checkout with the chosen dates and guests */
  book(): Promise<void>;
};

export type { Trip, TripOverview } from "@/demo/air-bnb/api/trip";
