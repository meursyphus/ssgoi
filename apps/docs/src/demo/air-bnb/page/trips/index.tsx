"use client";

import { useEffect } from "react";
import { useTrip } from "@/demo/air-bnb/state/trip";
import { UpcomingCard } from "./upcoming-card";
import { PastRow } from "./past-row";

export default function TripsPage() {
  const trip = useTrip((state) => ({
    trips: state.trips,
    actions: state.actions,
  }));
  useEffect(() => {
    trip.actions.load();
  }, [trip.actions]);
  const data = trip.trips.data;
  const loading = trip.trips.isLoading && data.upcoming.length === 0;

  return (
    <div className="flex-1 bg-white pb-10 pt-8">
      <h1 className="px-5 text-[30px] font-bold text-neutral-900">Trips</h1>
      <section className="px-5 pt-6">
        <h2 className="text-[18px] font-semibold text-neutral-900">
          Upcoming reservations
        </h2>
        <div className="space-y-6 pt-4">
          {loading ? (
            <div className="aspect-[16/10] animate-pulse rounded-2xl bg-neutral-100" />
          ) : (
            data.upcoming.map((t) => <UpcomingCard key={t.id} trip={t} />)
          )}
        </div>
      </section>
      {data.past.length > 0 && (
        <section className="px-5 pt-9">
          <h2 className="text-[18px] font-semibold text-neutral-900">
            Where you&apos;ve been
          </h2>
          <div className="space-y-4 pt-4">
            {data.past.map((t) => (
              <PastRow key={t.id} trip={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
