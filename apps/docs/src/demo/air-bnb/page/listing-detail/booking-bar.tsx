import Link from "next/link";
import type { ListingDetail } from "@/demo/air-bnb/state/listing";

export function BookingBar({ detail }: { detail: ListingDetail }) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-3 border-t border-neutral-200 bg-white px-5 pt-3 pb-5">
      <div className="flex flex-col">
        <span className="text-[15px] font-bold text-neutral-900">
          {detail.priceLabel}
        </span>
        <span className="text-[11px] text-neutral-500">{detail.dateLabel}</span>
      </div>
      <Link
        href={`/demo/air-bnb/listings/${detail.id}/checkout/review`}
        scroll={false}
        className="rounded-full bg-[#FF385C] px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_14px_-4px_rgba(255,56,92,0.6)] active:opacity-90"
      >
        Reserve
      </Link>
    </div>
  );
}
