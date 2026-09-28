"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/lib/link";
import type { CheckoutStep } from "@/demo/air-bnb/state/checkout";
import { useTrip } from "@/demo/air-bnb/state/trip";
import { routes } from "@/demo/air-bnb/page/shared/routes";
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
  const router = useRouter();
  const trip = useTrip((state) => ({ actions: state.actions }));
  const [booking, setBooking] = useState(false);

  // Book first so Trips renders the new reservation on its first frame, then
  // leave the checkout scope: the sheet drops onto the Trips tab.
  const confirm = async () => {
    if (booking) return;
    setBooking(true);
    try {
      await trip.actions.book();
      router.push(routes.trips, { scroll: false });
    } catch {
      setBooking(false);
    }
  };

  // Sticky, so the CTA stays on screen when a step is taller than the screen
  // (the 288px showcase clip, the desktop bezel). Content keeps 12px above the
  // home-indicator inset; 20px when there is none.
  return (
    <div className="sticky bottom-0 z-10 border-t border-neutral-100 bg-white px-5 pt-3 pb-[max(1.25rem,calc(var(--safe-bottom)+0.75rem))]">
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
          onClick={confirm}
          disabled={booking}
          className="w-full rounded-2xl bg-[#FF385C] py-4 text-[15px] font-semibold text-white active:opacity-90 disabled:opacity-70"
        >
          {booking ? "Booking…" : LABELS[step]}
        </button>
      )}
    </div>
  );
}
