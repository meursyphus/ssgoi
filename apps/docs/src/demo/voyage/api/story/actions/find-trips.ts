import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { TripsOverview } from "../types";

async function _findTrips(): Promise<TripsOverview> {
  return data.trips();
}

export const findTrips = createAction(_findTrips);
