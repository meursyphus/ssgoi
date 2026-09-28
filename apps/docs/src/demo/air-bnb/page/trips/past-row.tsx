import { Link } from "@/lib/link";
import type { Trip } from "@/demo/air-bnb/state/trip";
import { routes } from "@/demo/air-bnb/page/shared/routes";

export function PastRow({ trip }: { trip: Trip }) {
  return (
    <Link
      href={routes.listing(trip.id)}
      scroll={false}
      className="flex items-center gap-4 active:opacity-80"
    >
      <div
        className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100"
        data-zoom-exit-key={trip.id}
      >
        <img
          src={trip.thumbnail}
          alt={trip.title}
          width={900}
          height={900}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-neutral-900">
          {trip.region}
        </p>
        <p className="truncate text-[13px] text-neutral-500">{trip.title}</p>
        <p className="text-[13px] text-neutral-500">{trip.dateLabel}</p>
      </div>
    </Link>
  );
}
