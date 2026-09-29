"use client";

import { CalendarDays } from "lucide-react";
import { Link } from "@/lib/link";
import type { TripsOverview } from "@/demo/voyage/state/story";
import { BASE } from "../shared/routes";

export function UpcomingTrip({ trip }: { trip: TripsOverview["upcoming"] }) {
  return (
    <section className="px-5 pt-2" aria-label="Upcoming trip">
      <h2 className="text-[15px] font-bold tracking-tight text-neutral-900">
        Upcoming
      </h2>
      <Link
        href={`${BASE}/story/${trip.storyId}`}
        scroll={false}
        className="relative mt-3 block overflow-hidden rounded-3xl bg-neutral-100"
      >
        <img
          src={trip.cover}
          alt={trip.place}
          width={880}
          height={660}
          data-zoom-exit-key={trip.storyId}
          className="aspect-[4/3] w-full object-cover"
        />
        {/* Dark enough under the text block for a bright street photo. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 via-40% to-transparent to-80%" />
        <span className="absolute left-4 top-4 rounded-full bg-[#FF5A5F] px-3 py-1 text-[12px] font-semibold text-white shadow-sm">
          {trip.countdownLabel}
        </span>
        <div className="absolute inset-x-4 bottom-4 text-white">
          <div className="text-[22px] font-extrabold tracking-tight [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">
            {trip.place}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-white/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.3)]">
            <CalendarDays size={14} strokeWidth={2.25} />
            {trip.dateLabel}
            <span className="text-white/50">·</span>
            {trip.detailLabel}
          </div>
          <div className="mt-3 inline-flex rounded-full bg-white/90 px-3 py-1.5 text-[12.5px] font-semibold text-neutral-900 backdrop-blur">
            {trip.guideLabel}
          </div>
        </div>
      </Link>
    </section>
  );
}
