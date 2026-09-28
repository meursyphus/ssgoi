import { createAction } from "@/lib/utils";
import { listing } from "@/demo/air-bnb/api/listing";
import { data } from "../data";
import type { Trip, TripOverview } from "../types";

async function withListing(
  reservations: Array<{ id: string; dateLabel: string; statusLabel?: string }>,
): Promise<Trip[]> {
  const details = await Promise.all(
    reservations.map((r) => listing.find(r.id)),
  );
  return reservations.map((r, idx) => ({
    id: r.id,
    title: details[idx].title,
    region: details[idx].region,
    location: details[idx].locationDesc,
    thumbnail: details[idx].thumbnail,
    dateLabel: r.dateLabel,
    statusLabel: r.statusLabel,
  }));
}

async function _findAll(): Promise<TripOverview> {
  const [upcoming, past] = await Promise.all([
    withListing(data.upcoming()),
    withListing(data.past()),
  ]);
  return { upcoming, past };
}

export const findAll = createAction(_findAll);
