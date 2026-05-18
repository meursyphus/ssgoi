import { Check, X } from "lucide-react";
import type { ListingDetail } from "@/demo/air-bnb/state/listing";

export function PerksCard({ perks }: { perks: ListingDetail["perks"] }) {
  return (
    <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_10px_28px_-14px_rgba(0,0,0,0.18)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-neutral-900">
            {perks.label}
          </p>
          <p className="pt-1 text-[12px] leading-relaxed text-neutral-600">
            {perks.description}
          </p>
        </div>
        <button
          type="button"
          disabled
          className="text-neutral-400"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <button
        type="button"
        disabled
        className="mt-3 w-full rounded-xl bg-neutral-100 py-2 text-[12px] font-medium text-neutral-700"
      >
        Add 1 night
      </button>
    </div>
  );
}
