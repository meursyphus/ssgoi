import { model, query } from "comwit";
import { trip as tripAPI, type TripOverview } from "@/demo/air-bnb/api/trip";
import type { TripState } from "./types";

export const trip = model<TripState>({
  trips: query<TripOverview, void>({
    initialData: { upcoming: [], past: [] },
    queryFn: () => tripAPI.findAll(),
  }),
});
