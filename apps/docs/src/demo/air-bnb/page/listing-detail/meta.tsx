import type { ListingDetail } from "@/demo/air-bnb/state/listing";

export function DetailMeta({ detail }: { detail: ListingDetail }) {
  return (
    <div className="pb-5">
      <h1 className="text-[22px] font-bold leading-snug text-neutral-900">
        {detail.title}
      </h1>
      <p className="pt-3 text-[14px] text-neutral-700">{detail.locationDesc}</p>
      <p className="text-[14px] text-neutral-700">{detail.facilityLabel}</p>
    </div>
  );
}
