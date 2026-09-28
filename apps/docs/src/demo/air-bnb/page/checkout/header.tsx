"use client";

import { ArrowLeft, X } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { routes } from "@/demo/air-bnb/page/shared/routes";
import { useCheckoutStep } from "./use-checkout-step";
import { useCurrentListing } from "./use-current-listing";
import { getCheckoutStepHref, getPrevCheckoutStep } from "./steps";

export function CheckoutHeader() {
  const detail = useCurrentListing();
  const step = useCheckoutStep();
  const prevStep = getPrevCheckoutStep(step);
  const prevHref = prevStep ? getCheckoutStepHref(detail.id, prevStep) : null;
  const listingHref = routes.listing(detail.id);

  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between">
        {!prevHref ? (
          <span className="h-7 w-7" />
        ) : (
          <DemoBackLink
            fallback={prevHref}
            match={(path) => path === prevHref}
            className="flex h-7 w-7 items-center justify-center text-neutral-900"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </DemoBackLink>
        )}
        {/* Close skips every step back to the listing that opened checkout. */}
        <DemoBackLink
          fallback={listingHref}
          match={(path) => path === listingHref}
          className="flex h-7 w-7 items-center justify-center text-neutral-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </DemoBackLink>
      </div>
    </div>
  );
}
