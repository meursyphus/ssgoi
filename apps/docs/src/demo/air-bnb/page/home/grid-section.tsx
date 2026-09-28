import { Link } from "@/lib/link";
import type { FeedSection, ListingSimple } from "@/demo/air-bnb/state/listing";
import { routes } from "@/demo/air-bnb/page/shared/routes";
import { SaveButton } from "@/demo/air-bnb/page/shared/save-button";
import { SectionHeader } from "./section-header";

export function GridSection({ section }: { section: FeedSection }) {
  return (
    <section className="pt-6">
      <SectionHeader
        title={section.title}
        href={routes.collection(section.key)}
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4 pt-3">
        {section.items.map((l) => (
          <GridCard key={l.id} listing={l} />
        ))}
      </div>
    </section>
  );
}

function GridCard({ listing }: { listing: ListingSimple }) {
  return (
    <div className="relative">
      <Link
        href={routes.listing(listing.id)}
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
            <span className="whitespace-nowrap font-medium text-neutral-700">
              ★ {listing.rating}
            </span>
          </p>
        </div>
      </Link>
      <SaveButton listingId={listing.id} className="absolute right-1 top-1" />
    </div>
  );
}
