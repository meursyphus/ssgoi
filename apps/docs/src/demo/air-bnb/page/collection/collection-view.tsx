import { ChevronLeft, Heart } from "lucide-react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import type { ListingCollection } from "@/demo/air-bnb/state/listing";
import { isCollectionParent } from "@/demo/air-bnb/page/shared/routes";
import { ResultCard } from "./result-card";

export function CollectionView({
  collection,
  fallback,
  loading = false,
}: {
  collection: ListingCollection;
  /** Where Back goes when the list was opened directly */
  fallback: string;
  loading?: boolean;
}) {
  return (
    <SsgoiRouteBoundary className="relative block min-h-full w-full bg-white">
      <div className="sticky top-0 z-20 flex h-14 items-center bg-white/95 px-3 backdrop-blur">
        {/* Back to whichever page opened the list (Explore, Wishlists or
            Search); `fallback` when it was opened directly. */}
        <DemoBackLink
          fallback={fallback}
          match={isCollectionParent}
          aria-label="Back"
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 active:bg-neutral-100"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
        </DemoBackLink>
      </div>
      <div className="px-5 pb-1">
        <h1 className="text-[26px] font-bold leading-tight text-neutral-900">
          {loading ? " " : collection.title}
        </h1>
        <p className="pt-1 text-[13px] text-neutral-500">
          {loading ? " " : collection.subtitle}
        </p>
      </div>
      {loading ? (
        <div className="space-y-7 px-5 pt-5">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-[20/19] animate-pulse rounded-2xl bg-neutral-100"
            />
          ))}
        </div>
      ) : collection.items.length === 0 ? (
        <div className="flex flex-col items-center px-10 pt-24 text-center">
          <Heart className="h-9 w-9 text-neutral-300" strokeWidth={1.8} />
          <p className="pt-4 text-[16px] font-semibold text-neutral-900">
            Nothing saved yet
          </p>
          <p className="pt-1.5 text-[13px] leading-relaxed text-neutral-500">
            Tap the heart on any home to save it to this wishlist.
          </p>
        </div>
      ) : (
        <div className="space-y-7 px-5 pb-10 pt-5">
          {collection.items.map((item) => (
            <ResultCard key={item.id} listing={item} />
          ))}
        </div>
      )}
    </SsgoiRouteBoundary>
  );
}
