"use client";

import type { TripsOverview } from "@/demo/voyage/state/story";
import { TabHeader } from "../shared/tab-header";
import { UpcomingTrip } from "./upcoming-trip";
import { PastTrips } from "./past-trips";

export default function TripsPage({ trips }: { trips: TripsOverview }) {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <TabHeader title="Trips" subtitle={trips.summary} />
      <div className="flex-1 pb-8">
        <UpcomingTrip trip={trips.upcoming} />
        <PastTrips trips={trips.past} />
      </div>
    </div>
  );
}
