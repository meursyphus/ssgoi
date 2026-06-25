"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { axis } from "@ssgoi/react/view-transitions";
import { SsgoiTransitionBoundary } from "@/lib/components/ssgoi-transition-boundary";
import { useListing, type ListingDetail } from "@/demo/air-bnb/state/listing";
import { useCheckout } from "@/demo/air-bnb/state/checkout";
import { CheckoutHeader } from "./header";
import { CheckoutBottomBar } from "./bottom-bar";
import { CHECKOUT_STEP_ORDER, getCheckoutStepHref } from "./steps";
import { useShowcaseHost } from "@/lib/components/demo-shell";
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
  const config: SsgoiConfig = useMemo(
    () => ({
      preserveScroll: {
        key: `${initialData.id}/checkout`,
      },
      transitions: [
        axis({
          paths: CHECKOUT_STEP_ORDER.map((step) =>
            getCheckoutStepHref(initialData.id, step),
          ),
          type: "x",
        }),
      ],
    }),
    [initialData.id],
  );
  const host = useShowcaseHost();
  return (
    <div className="relative flex min-h-full w-full flex-col bg-white">
      <CheckoutHeader />
      <div className="relative z-0 flex-1 pb-3">
        <Ssgoi config={config} host={host}>
          <SsgoiTransitionBoundary className="min-h-full bg-white">
            {children}
          </SsgoiTransitionBoundary>
        </Ssgoi>
      </div>
      <CheckoutBottomBar />
    </div>
  );
}
