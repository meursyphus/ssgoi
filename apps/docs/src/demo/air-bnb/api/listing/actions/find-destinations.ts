import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { Destination } from "../types";

async function _findDestinations(query: string): Promise<Destination[]> {
  return data.destinations(query);
}

export const findDestinations = createAction(_findDestinations);
