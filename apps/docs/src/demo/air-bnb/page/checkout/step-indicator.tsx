import type { CheckoutStep } from "@/demo/air-bnb/state/checkout";

const ORDER: CheckoutStep[] = ["review", "method", "confirm"];

export function StepIndicator({ step }: { step: CheckoutStep }) {
  const activeIdx = ORDER.indexOf(step);
  return (
    <div className="flex items-center justify-center gap-2">
      {ORDER.map((_, idx) => (
        <span
          key={idx}
          className={`h-1 w-12 rounded-full ${
            idx <= activeIdx ? "bg-neutral-900" : "bg-neutral-200"
          }`}
        />
      ))}
    </div>
  );
}
