import type { ListingDetail } from "@/demo/air-bnb/state/listing";

export function DetailStats({ detail }: { detail: ListingDetail }) {
  return (
    <div className="grid grid-cols-3 divide-x divide-neutral-200 rounded-2xl border border-neutral-200 py-3.5">
      <div className="flex flex-col items-center px-2">
        <span className="text-[16px] font-bold text-neutral-900">
          {detail.rating}
        </span>
        <span className="pt-1 text-[9px] tracking-[0.3em] text-neutral-700">
          ★★★★★
        </span>
      </div>
      <div className="flex flex-col items-center px-2 text-center">
        <span className="text-[18px] leading-none">🏆</span>
        <span className="pt-1.5 text-[10px] font-semibold leading-tight text-neutral-900">
          {detail.badge ?? "Top rated"}
        </span>
      </div>
      <div className="flex flex-col items-center px-2">
        <span className="text-[16px] font-bold text-neutral-900">
          {detail.reviewCount}
        </span>
        <span className="pt-1 text-[10px] text-neutral-500">Reviews</span>
      </div>
    </div>
  );
}
