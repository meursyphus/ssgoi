"use client";

import { SsgoiTransition } from "@ssgoi/react";
import { CreditCard } from "lucide-react";
import {
  useCheckout,
  type CheckoutMethod,
} from "@/demo/air-bnb/state/checkout";
import { CHECKOUT_STEP_TRANSITION_IDS } from "./steps";
import { CheckoutTitle } from "./title";

type Option = {
  key: CheckoutMethod;
  label: string;
  icon: React.ReactNode;
  brandRow?: React.ReactNode;
};

const OPTIONS: Option[] = [
  {
    key: "card",
    label: "Credit or debit card",
    icon: <CreditCard className="h-5 w-5 text-neutral-800" />,
    brandRow: (
      <div className="flex items-center gap-1.5 pt-1">
        <BrandPill bg="#1A1F71" fg="white" label="VISA" />
        <BrandPill bg="#EB001B" fg="white" label="MC" />
        <BrandPill bg="#006FCF" fg="white" label="AMEX" />
      </div>
    ),
  },
  {
    key: "naver",
    label: "Naver Pay",
    icon: (
      <span className="flex h-6 min-w-[40px] items-center justify-center rounded-md bg-[#03C75A] px-1.5 text-[10px] font-bold text-white">
        N Pay
      </span>
    ),
  },
  {
    key: "kakao",
    label: "Kakao Pay (Alipay+ partners)",
    icon: (
      <span className="flex h-6 min-w-[40px] items-center justify-center rounded-md bg-[#FEE500] px-1.5 text-[10px] font-bold text-neutral-900">
        pay
      </span>
    ),
  },
];

function BrandPill({
  bg,
  fg,
  label,
}: {
  bg: string;
  fg: string;
  label: string;
}) {
  return (
    <span
      style={{ backgroundColor: bg, color: fg }}
      className="rounded-sm px-1.5 py-0.5 text-[8px] font-bold tracking-wider"
    >
      {label}
    </span>
  );
}

export function MethodStep() {
  const checkout = useCheckout((state) => ({
    method: state.selectedMethod,
    actions: state.actions,
  }));

  return (
    <SsgoiTransition id={CHECKOUT_STEP_TRANSITION_IDS.method}>
      <CheckoutTitle step="method" />
      <div className="px-5 pt-5">
        <p className="text-[13px] text-neutral-700">
          Available payment methods for KRW.
        </p>
        <button
          type="button"
          disabled
          className="text-[13px] font-medium underline text-neutral-900"
        >
          Change currency
        </button>

        <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200">
          {OPTIONS.map((option, idx) => {
            const selected = checkout.method === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => checkout.actions.setMethod(option.key)}
                className={`flex w-full items-start justify-between gap-3 px-4 py-4 text-left ${
                  idx !== OPTIONS.length - 1
                    ? "border-b border-neutral-100"
                    : ""
                }`}
              >
                <div className="flex flex-1 items-start gap-3">
                  <span className="flex h-6 w-10 flex-shrink-0 items-center justify-center">
                    {option.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-neutral-900">
                      {option.label}
                    </p>
                    {option.brandRow}
                  </div>
                </div>
                <span
                  className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    selected
                      ? "border-neutral-900 bg-white"
                      : "border-neutral-300 bg-white"
                  }`}
                >
                  {selected && (
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <h3 className="pt-6 text-[14px] font-bold text-neutral-900">
          Unavailable
        </h3>
        <div className="mt-2 rounded-2xl border border-neutral-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-10 items-center justify-center rounded-md bg-[#EB001B]/10 text-[10px] font-bold text-[#EB001B]">
                MC
              </span>
              <div>
                <p className="text-[13px] text-neutral-400">2023</p>
                <p className="text-[11px] text-neutral-400">Expired</p>
              </div>
            </div>
            <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-neutral-200 bg-neutral-100" />
          </div>
        </div>

        <p className="pt-4 text-[11px] leading-relaxed text-neutral-500">
          Since payment is processed overseas, your card issuer may charge
          additional fees.
        </p>
      </div>
    </SsgoiTransition>
  );
}
