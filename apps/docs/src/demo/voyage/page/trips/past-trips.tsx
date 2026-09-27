"use client";

import { Link } from "@/lib/link";
import type { Trip } from "@/demo/voyage/state/story";
import { BASE } from "../shared/routes";

export function PastTrips({ trips }: { trips: Trip[] }) {
  return (
    <section className="px-5 pt-8" aria-label="Past trips">
      <h2 className="text-[15px] font-bold tracking-tight text-neutral-900">
        Past trips
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-5">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            href={`${BASE}/story/${trip.storyId}`}
            scroll={false}
            className="flex flex-col"
          >
            <div className="overflow-hidden rounded-2xl bg-neutral-100">
              <img
                src={trip.cover}
                alt={trip.place}
                width={660}
                height={825}
                loading="lazy"
                data-zoom-exit-key={trip.storyId}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <span className="mt-2 text-[14px] font-semibold text-neutral-900">
              {trip.place}
            </span>
            <span className="mt-0.5 text-[12.5px] text-neutral-500">
              {trip.dateLabel}
              <span className="px-1 text-neutral-300">·</span>
              {trip.detailLabel}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
