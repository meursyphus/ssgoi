import { Link } from "@/lib/link";
import { ChevronRight, Heart } from "lucide-react";
import type { ListingSimple } from "@/demo/air-bnb/state/listing";

export function PopularSection({
  listings,
  loading,
}: {
  listings: ListingSimple[];
  loading: boolean;
}) {
  return (
    <section className="pt-6">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-[20px] font-bold text-neutral-900">
          Popular homes in Seoul
        </h2>
        <ChevronRight className="h-5 w-5 text-neutral-500" />
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 pt-3">
        {loading
          ? Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square animate-pulse rounded-2xl bg-neutral-100"
              />
            ))
          : listings.map((l) => <PopularCard key={l.id} listing={l} />)}
      </div>
    </section>
  );
}

function PopularCard({ listing }: { listing: ListingSimple }) {
  return (
    <Link
      href={`/demo/air-bnb/listings/${listing.id}`}
      scroll={false}
      className="flex flex-col gap-2"
    >
      <div
        className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100"
        data-zoom-exit-key={listing.id}
      >
        <img
          src={listing.thumbnail}
          alt={listing.region}
          width={900}
          height={900}
          className="h-full w-full object-cover"
        />
        {listing.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-neutral-900 shadow-sm">
            {listing.badge}
          </span>
        )}
        <span className="pointer-events-none absolute right-2 top-2 text-white drop-shadow">
          <Heart className="h-5 w-5" strokeWidth={2.2} />
        </span>
      </div>
      <div className="px-0.5">
        <p className="line-clamp-1 text-[14px] font-semibold text-neutral-900">
          {listing.region}
        </p>
        <p className="text-[12px] text-neutral-500">{listing.dateLabel}</p>
        <p className="pt-0.5 text-[12px]">
          <span className="font-semibold text-neutral-900">
            {listing.priceLabel}
          </span>
          <span className="text-neutral-400"> · </span>
          <span className="font-medium text-neutral-700">
            ★ {listing.rating}
          </span>
        </p>
      </div>
    </Link>
  );
}
