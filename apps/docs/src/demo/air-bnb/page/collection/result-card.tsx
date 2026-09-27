import { Link } from "@/lib/link";
import type { ListingSimple } from "@/demo/air-bnb/state/listing";
import { routes } from "@/demo/air-bnb/page/shared/routes";
import { SaveButton } from "@/demo/air-bnb/page/shared/save-button";

export function ResultCard({ listing }: { listing: ListingSimple }) {
  return (
    <div className="relative">
      <Link href={routes.listing(listing.id)} scroll={false} className="block">
        <div
          className="relative aspect-[20/19] overflow-hidden rounded-2xl bg-neutral-100"
          data-zoom-exit-key={listing.id}
        >
          <img
            src={listing.thumbnail}
            alt={listing.title}
            width={900}
            height={900}
            className="h-full w-full object-cover"
          />
          {listing.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-neutral-900 shadow-sm">
              {listing.badge}
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-3 pt-3">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-neutral-900">
              {listing.region}
            </p>
            <p className="truncate text-[14px] text-neutral-500">
              {listing.title}
            </p>
            <p className="text-[14px] text-neutral-500">
              {listing.bedroomLabel} · {listing.dateLabel}
            </p>
            <p className="pt-1 text-[14px] font-semibold text-neutral-900 underline underline-offset-2">
              {listing.priceLabel}
            </p>
          </div>
          <span className="flex-shrink-0 text-[14px] text-neutral-900">
            ★ {listing.rating}
          </span>
        </div>
      </Link>
      <SaveButton
        listingId={listing.id}
        size="lg"
        className="absolute right-2 top-2"
      />
    </div>
  );
}
