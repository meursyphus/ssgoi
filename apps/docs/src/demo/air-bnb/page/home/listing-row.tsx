import { Link } from "@/lib/link";
import { DragScroller } from "@/lib/components/drag-scroller";
import type { FeedSection, ListingSimple } from "@/demo/air-bnb/state/listing";
import { routes } from "@/demo/air-bnb/page/shared/routes";
import { SaveButton } from "@/demo/air-bnb/page/shared/save-button";
import { SectionHeader } from "./section-header";

export function ListingRow({ section }: { section: FeedSection }) {
  return (
    <section className="pt-6">
      <SectionHeader
        title={section.title}
        href={routes.collection(section.key)}
      />
      <DragScroller className="pt-3" trackClassName="gap-3 px-4">
        {section.items.map((l) => (
          <RowCard key={l.id} listing={l} />
        ))}
      </DragScroller>
    </section>
  );
}

function RowCard({ listing }: { listing: ListingSimple }) {
  return (
    <div className="relative w-36 flex-shrink-0">
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
      <SaveButton listingId={listing.id} className="absolute right-1 top-1" />
    </div>
  );
}
