"use client";

import { useListing, type ListingDetail } from "@/demo/air-bnb/state/listing";
import { DetailHero } from "./hero";
import { DetailHeader } from "./header";
import { DetailMeta } from "./meta";
import { DetailStats } from "./stats";
import { PerksCard } from "./perks-card";
import { AmenitiesGrid } from "./amenities-grid";
import { BookingBar } from "./booking-bar";
import { SsgoiTransitionBoundary } from "@/lib/components/ssgoi-transition-boundary";
export default function ListingDetailPage({
  initialData,
}: {
  initialData: ListingDetail;
}) {
  const listing = useListing((state) => ({
    current: state.currentListing,
    actions: state.actions,
  }));
  listing.actions.init(initialData);
  const detail = listing.current ?? initialData;
  return (
    <SsgoiTransitionBoundary className="relative block min-h-full w-full bg-white">
      <DetailHero detail={detail} />
      <DetailHeader />
      <div className="relative -mt-6 rounded-t-3xl bg-white px-5 pt-5 pb-6">
        <DetailMeta detail={detail} />
        <DetailStats detail={detail} />
        <PerksCard perks={detail.perks} />
        <AmenitiesGrid amenities={detail.amenities} />
      </div>
      <BookingBar detail={detail} />
    </SsgoiTransitionBoundary>
  );
}
