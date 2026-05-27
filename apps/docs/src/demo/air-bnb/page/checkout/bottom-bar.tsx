"use client";

import { Link } from "@/lib/link";
import { toast } from "sonner";
import type { CheckoutStep } from "@/demo/air-bnb/state/checkout";
import { StepIndicator } from "./step-indicator";
import { useCheckoutStep } from "./use-checkout-step";
import { useCurrentListing } from "./use-current-listing";
import { getCheckoutStepHref, getNextCheckoutStep } from "./steps";

const LABELS: Record<CheckoutStep, string> = {
  review: "Next",
  method: "Next",
  confirm: "Confirm booking",
};

export function CheckoutBottomBar() {
  const detail = useCurrentListing();
  const step = useCheckoutStep();
  const nextStep = getNextCheckoutStep(step);

  return (
    <div className="border-t border-neutral-100 bg-white px-5 pb-5 pt-3">
      <div className="pb-3">
        <StepIndicator step={step} />
      </div>
      {nextStep ? (
        <Link
          href={getCheckoutStepHref(detail.id, nextStep)}
          scroll={false}
          className="block w-full rounded-2xl bg-neutral-900 py-4 text-center text-[15px] font-semibold text-white active:opacity-90"
        >
          {LABELS[step]}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => toast.success("결제가 완료되었습니다")}
          className="w-full rounded-2xl bg-neutral-900 py-4 text-[15px] font-semibold text-white active:opacity-90"
        >
          {LABELS[step]}
        </button>
      )}
    </div>
  );
}
