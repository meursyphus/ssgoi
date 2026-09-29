import { create } from "comwit";
import { trip } from "./model";
import { loadActions } from "./actions/load";
import { bookActions } from "./actions/book";
import type { TripState, TripActions } from "./types";

export * from "./types";

export const useTrip = create<TripState, TripActions>(trip, {
  actions: [loadActions, bookActions],
});
