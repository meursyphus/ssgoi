import type { CheckoutStep } from "@/demo/air-bnb/state/checkout";

const TITLES: Record<CheckoutStep, string> = {
  review: "Review and continue",
  method: "Add a payment method",
  confirm: "Confirm your booking",
};

export function CheckoutTitle({ step }: { step: CheckoutStep }) {
  return (
    <h1 className="px-5 pt-5 text-[26px] font-bold leading-tight text-neutral-900">
      {TITLES[step]}
    </h1>
  );
}
