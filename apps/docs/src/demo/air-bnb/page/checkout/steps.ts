import type { CheckoutStep } from "@/demo/air-bnb/state/checkout";

export const CHECKOUT_STEP_TRANSITION_IDS: Record<CheckoutStep, string> = {
  review: "/checkout/review",
  method: "/checkout/method",
  confirm: "/checkout/confirm",
};

export const CHECKOUT_STEP_ORDER: CheckoutStep[] = [
  "review",
  "method",
  "confirm",
];

export function getCheckoutStepHref(
  listingId: string,
  step: CheckoutStep,
): string {
  return `/demo/air-bnb/listings/${listingId}/checkout/${step}`;
}

export function getNextCheckoutStep(step: CheckoutStep): CheckoutStep | null {
  const index = CHECKOUT_STEP_ORDER.indexOf(step);
  return index >= 0 ? (CHECKOUT_STEP_ORDER[index + 1] ?? null) : null;
}

export function getPrevCheckoutStep(step: CheckoutStep): CheckoutStep | null {
  const index = CHECKOUT_STEP_ORDER.indexOf(step);
  return index > 0 ? CHECKOUT_STEP_ORDER[index - 1] : null;
}

export function getCheckoutStepFromPathname(pathname: string): CheckoutStep {
  const segment = pathname.split("/").filter(Boolean).at(-1);
  if (segment === "review" || segment === "method" || segment === "confirm") {
    return segment;
  }
  return "review";
}
