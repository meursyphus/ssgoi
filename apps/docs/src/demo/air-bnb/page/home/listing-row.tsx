import { Link } from "@/lib/link";
import { ChevronRight, Heart } from "lucide-react";
import { DragScroller } from "@/lib/components/drag-scroller";
import type { ListingSimple } from "@/demo/air-bnb/state/listing";

export function ListingRow({
  title,
  listings,
  loading,
}: {
  title: string;
  listings: ListingSimple[];
  loading: boolean;
}) {
  return (
    <section className="pt-6">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-[20px] font-bold text-neutral-900">{title}</h2>
        <ChevronRight className="h-5 w-5 text-neutral-500" />
      </div>
      <DragScroller className="pt-3" trackClassName="gap-3 px-4">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-44 w-36 flex-shrink-0 animate-pulse rounded-2xl bg-neutral-100"
              />
            ))
          : listings.map((l) => <RowCard key={l.id} listing={l} />)}
      </DragScroller>
    </section>
  );
}

function RowCard({ listing }: { listing: ListingSimple }) {
  return (
    <Link
      href={`/demo/air-bnb/listings/${listing.id}`}
      scroll={false}
      className="flex w-36 flex-shrink-0 flex-col gap-2"
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
        <span className="pointer-events-none absolute right-2 top-2 text-white drop-shadow">
          <Heart className="h-5 w-5" strokeWidth={2.2} />
        </span>
      </div>
      <div className="px-0.5">
        <p className="truncate text-[14px] font-semibold text-neutral-900">
          {listing.region}
        </p>
        <p className="pt-0.5 text-[12px] text-neutral-500">
          {listing.bedroomLabel} <span className="text-neutral-400">·</span>{" "}
          <span className="font-medium text-neutral-700">
            ★ {listing.rating}
          </span>
        </p>
      </div>
    </Link>
  );
}
