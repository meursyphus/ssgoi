"use client";

import { CheckoutTitle } from "./title";
import { useCurrentListing } from "./use-current-listing";
export function ReviewStep() {
  const detail = useCurrentListing();
  return (
    <div>
      <CheckoutTitle step="review" />
      <div className="px-5 pt-5">
        <div className="rounded-2xl border border-neutral-200 p-3">
          <div className="flex items-start gap-3">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              <img
                src={detail.thumbnail}
                alt={detail.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="line-clamp-2 text-[13px] font-medium leading-snug text-neutral-900">
                {detail.title}
              </p>
              <p className="pt-1.5 text-[11px] text-neutral-500">
                ★ {detail.rating} ({detail.reviewCount} reviews)
                {detail.badge ? (
                  <span>
                    <span className="px-1 text-neutral-300">·</span>
                    <span className="text-neutral-700">🏆 {detail.badge}</span>
                  </span>
                ) : null}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <SummaryRow label="Dates" value={detail.dateLabel} action="Change" />
          <SummaryRow label="Guests" value="1 adult" action="Change" />
          <SummaryRow
            label="Total price"
            value={`₩${detail.priceKRW.toLocaleString()} KRW`}
            action="Details"
          />
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <p className="text-[13px] font-semibold text-neutral-900">
            Free cancellation
          </p>
          <p className="pt-1.5 text-[12px] leading-relaxed text-neutral-500">
            Cancel within 24 hours of booking for a full refund.{" "}
            <button
              type="button"
              disabled
              className="underline text-neutral-700"
            >
              Full refund policy
            </button>
          </p>
        </div>

        <div className="pt-5">
          <h3 className="text-[15px] font-bold text-neutral-900">
            Payment plan
          </h3>
          <div className="pt-2">
            <PayTimingOption
              label={`Pay ₩${detail.priceKRW.toLocaleString()} now`}
              selected
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function SummaryRow({
  label,
  value,
  action,
}: {
  label: string;
  value: string;
  action?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-neutral-100 py-3.5">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-semibold text-neutral-900">
          {label}
        </span>
        <span className="text-[12px] text-neutral-500">{value}</span>
      </div>
      {action && (
        <button
          type="button"
          disabled
          className="rounded-full border border-neutral-200 px-3 py-1.5 text-[11px] font-medium text-neutral-700"
        >
          {action}
        </button>
      )}
    </div>
  );
}
function PayTimingOption({
  label,
  selected,
}: {
  label: string;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      disabled
      className="flex w-full items-center justify-between rounded-2xl border border-neutral-300 px-4 py-3.5 text-left"
    >
      <span className="text-[13px] font-medium text-neutral-900">{label}</span>
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? "border-neutral-900 bg-white" : "border-neutral-300 bg-white"}`}
      >
        {selected && (
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
        )}
      </span>
    </button>
  );
}
