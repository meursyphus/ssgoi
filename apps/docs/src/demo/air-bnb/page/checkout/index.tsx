"use client";

import { useEffect, type ReactNode } from "react";
import { SsgoiTransitionBoundary } from "@/lib/components/ssgoi-transition-boundary";
import { useListing, type ListingDetail } from "@/demo/air-bnb/state/listing";
import { useCheckout } from "@/demo/air-bnb/state/checkout";
import { CheckoutHeader } from "./header";
import { CheckoutBottomBar } from "./bottom-bar";
export default function CheckoutLayoutClient({
  initialData,
  children,
}: {
  initialData: ListingDetail;
  children: ReactNode;
}) {
  const listing = useListing((state) => ({
    actions: state.actions,
  }));
  listing.actions.init(initialData);
  const checkout = useCheckout((state) => ({
    actions: state.actions,
  }));
  useEffect(() => {
    checkout.actions.reset();
    return () => checkout.actions.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SsgoiTransitionBoundary
      scope={() => `${initialData.id}/checkout`}
      className="relative flex min-h-full w-full flex-col bg-white"
    >
      <CheckoutHeader />
      <div className="relative z-0 flex-1 pb-3">
        <SsgoiTransitionBoundary className="min-h-full bg-white">
          {children}
        </SsgoiTransitionBoundary>
      </div>
      <CheckoutBottomBar />
    </SsgoiTransitionBoundary>
  );
}
