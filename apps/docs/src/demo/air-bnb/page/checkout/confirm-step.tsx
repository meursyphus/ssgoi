"use client";

import { Check } from "lucide-react";
import { useCheckout } from "@/demo/air-bnb/state/checkout";
import { CHECKOUT_STEP_TRANSITION_IDS } from "./steps";
import { CheckoutTitle } from "./title";
import { useCurrentListing } from "./use-current-listing";
const METHOD_LABEL = {
  card: "Credit / debit card",
  naver: "Naver Pay",
  kakao: "Kakao Pay",
} as const;
export function ConfirmStep() {
  const detail = useCurrentListing();
  const checkout = useCheckout((state) => ({
    method: state.selectedMethod,
  }));
  return (
    <div data-ssgoi-transition={CHECKOUT_STEP_TRANSITION_IDS.confirm}>
      <CheckoutTitle step="confirm" />
      <div className="px-5 pt-5">
        <p className="text-[13px] text-neutral-700">
          One last check before we confirm your booking.
        </p>

        <div className="mt-4 space-y-3">
          <ConfirmRow label="Stay" value={detail.title} />
          <ConfirmRow label="Dates" value={detail.dateLabel} />
          <ConfirmRow label="Guests" value="1 adult" />
          <ConfirmRow label="Payment" value={METHOD_LABEL[checkout.method]} />
          <ConfirmRow
            label="Total"
            value={`₩${detail.priceKRW.toLocaleString()}`}
            emphasized
          />
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-3.5">
          <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <p className="text-[12px] leading-relaxed text-emerald-700">
            {detail.refundLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
function ConfirmRow({
  label,
  value,
  emphasized,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-200 px-4 py-3">
      <span className="text-[12px] font-medium text-neutral-500">{label}</span>
      <span
        className={`max-w-[60%] text-right text-[13px] ${emphasized ? "font-bold text-neutral-900" : "text-neutral-900"}`}
      >
        {value}
      </span>
    </div>
  );
}
