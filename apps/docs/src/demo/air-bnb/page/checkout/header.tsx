"use client";

import { Link } from "@/lib/link";
import { ArrowLeft, X } from "lucide-react";
import { useCheckoutStep } from "./use-checkout-step";
import { useCurrentListing } from "./use-current-listing";
import { getCheckoutStepHref, getPrevCheckoutStep } from "./steps";

export function CheckoutHeader() {
  const detail = useCurrentListing();
  const step = useCheckoutStep();
  const prevStep = getPrevCheckoutStep(step);

  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between">
        {!prevStep ? (
          <span className="h-7 w-7" />
        ) : (
          <Link
            href={getCheckoutStepHref(detail.id, prevStep)}
            scroll={false}
            className="flex h-7 w-7 items-center justify-center text-neutral-900"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <Link
          href={`/demo/air-bnb/listings/${detail.id}`}
          scroll={false}
          className="flex h-7 w-7 items-center justify-center text-neutral-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
