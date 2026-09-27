"use client";

import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import { useListing, type ListingDetail } from "@/demo/air-bnb/state/listing";
import { TourHeader } from "./header";
import { PhotoGrid } from "./photo-grid";

export default function PhotoTourPage({
  initialData,
}: {
  initialData: ListingDetail;
}) {
  const listing = useListing((state) => ({
    current: state.currentListing,
    actions: state.actions,
  }));
  listing.actions.init(initialData);
  const detail =
    listing.current?.id === initialData.id ? listing.current : initialData;
  return (
    <SsgoiRouteBoundary className="relative block min-h-full w-full bg-white">
      <TourHeader id={detail.id} />
      <div className="px-4 pb-4">
        <h1 className="text-[26px] font-bold text-neutral-900">Photo tour</h1>
        <p className="pt-1 text-[13px] text-neutral-500">
          {detail.images.length}{" "}
          {detail.images.length === 1 ? "photo" : "photos"} · {detail.region}
        </p>
      </div>
      <PhotoGrid detail={detail} />
    </SsgoiRouteBoundary>
  );
}
