import { Link } from "@/lib/link";
import type { Trip } from "@/demo/air-bnb/state/trip";
import { routes } from "@/demo/air-bnb/page/shared/routes";

export function UpcomingCard({ trip }: { trip: Trip }) {
  return (
    <Link
      href={routes.listing(trip.id)}
      scroll={false}
      className="block active:opacity-90"
    >
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100"
        data-zoom-exit-key={trip.id}
      >
        <img
          src={trip.thumbnail}
          alt={trip.title}
          width={900}
          height={900}
          className="h-full w-full object-cover"
        />
        {trip.statusLabel && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-neutral-900 shadow-sm">
            {trip.statusLabel}
          </span>
        )}
      </div>
      <div className="px-0.5 pt-3">
        <p className="line-clamp-1 text-[17px] font-semibold text-neutral-900">
          {trip.title}
        </p>
        <p className="pt-0.5 text-[13px] text-neutral-500">{trip.location}</p>
        <p className="pt-2 text-[13px] font-medium text-neutral-900">
          {trip.dateLabel}
        </p>
      </div>
    </Link>
  );
}
