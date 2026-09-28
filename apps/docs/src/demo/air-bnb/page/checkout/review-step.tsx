"use client";

import { useState, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  MAX_GUESTS,
  useCheckout,
  type CheckoutPayPlan,
} from "@/demo/air-bnb/state/checkout";
import { CheckoutTitle } from "./title";
import { useCurrentListing } from "./use-current-listing";

type Panel = "dates" | "guests" | "price" | "refund";

export function ReviewStep() {
  const detail = useCurrentListing();
  const checkout = useCheckout((state) => ({
    dateLabel: state.dateLabel,
    guests: state.guests,
    payPlan: state.payPlan,
    actions: state.actions,
  }));
  const [open, setOpen] = useState<Panel | null>(null);
  const toggle = (panel: Panel) => setOpen((v) => (v === panel ? null : panel));
  const dateLabel = checkout.dateLabel ?? detail.dateLabel;

  return (
    <div>
      <CheckoutTitle step="review" />
      <div className="px-5 pt-5">
        <div className="rounded-2xl border border-neutral-200 p-3">
          <div className="flex items-start gap-3">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              <img
                src={detail.thumbnail}
                alt={detail.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="line-clamp-2 text-[13px] font-medium leading-snug text-neutral-900">
                {detail.title}
              </p>
              <p className="pt-1.5 text-[11px] text-neutral-500">
                ★ {detail.rating} ({detail.reviewCount} reviews)
                {detail.badge ? (
                  <span>
                    <span className="px-1 text-neutral-300">·</span>
                    <span className="text-neutral-700">🏆 {detail.badge}</span>
                  </span>
                ) : null}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <SummaryRow
            label="Dates"
            value={dateLabel}
            action={open === "dates" ? "Done" : "Change"}
            onAction={() => toggle("dates")}
          >
            {open === "dates" && (
              <div className="flex flex-wrap gap-2 pt-3">
                {detail.dateOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={option === dateLabel}
                    onClick={() => checkout.actions.setDates(option)}
                    className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                      option === dateLabel
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 text-neutral-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </SummaryRow>
          <SummaryRow
            label="Guests"
            value={`${checkout.guests} ${checkout.guests === 1 ? "adult" : "adults"}`}
            action={open === "guests" ? "Done" : "Change"}
            onAction={() => toggle("guests")}
          >
            {open === "guests" && (
              <div className="flex items-center justify-between pt-3">
                <span className="text-[12px] text-neutral-500">
                  Adults · up to {MAX_GUESTS}
                </span>
                <div className="flex items-center gap-3">
                  <StepperButton
                    label="Fewer guests"
                    disabled={checkout.guests <= 1}
                    onClick={() =>
                      checkout.actions.setGuests(checkout.guests - 1)
                    }
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </StepperButton>
                  <span className="w-4 text-center text-[14px] tabular-nums text-neutral-900">
                    {checkout.guests}
                  </span>
                  <StepperButton
                    label="More guests"
                    disabled={checkout.guests >= MAX_GUESTS}
                    onClick={() =>
                      checkout.actions.setGuests(checkout.guests + 1)
                    }
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </StepperButton>
                </div>
              </div>
            )}
          </SummaryRow>
          <SummaryRow
            label="Total price"
            value={`₩${detail.priceKRW.toLocaleString()} KRW`}
            action={open === "price" ? "Hide" : "Details"}
            onAction={() => toggle("price")}
          >
            {open === "price" && (
              <div className="space-y-1.5 pt-3">
                {detail.priceBreakdown.map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between text-[12px] text-neutral-600"
                  >
                    <span>{row.label}</span>
                    <span className="tabular-nums">{row.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </SummaryRow>
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <p className="text-[13px] font-semibold text-neutral-900">
            Free cancellation
          </p>
          <p className="pt-1.5 text-[12px] leading-relaxed text-neutral-500">
            Cancel within 24 hours of booking for a full refund.{" "}
            <button
              type="button"
              aria-expanded={open === "refund"}
              onClick={() => toggle("refund")}
              className="underline text-neutral-700"
            >
              Full refund policy
            </button>
          </p>
          <Expand show={open === "refund"}>
            <p className="mt-2 rounded-xl bg-neutral-50 px-3 py-2.5 text-[12px] leading-relaxed text-neutral-700">
              {detail.refundLabel}
            </p>
          </Expand>
        </div>

        <div className="pt-5">
          <h3 className="text-[15px] font-bold text-neutral-900">
            Payment plan
          </h3>
          <div className="space-y-2 pt-2">
            <PayTimingOption
              plan="full"
              label={detail.payPlans.full}
              selected={checkout.payPlan === "full"}
              onSelect={(plan) => checkout.actions.setPayPlan(plan)}
            />
            <PayTimingOption
              plan="split"
              label={detail.payPlans.split}
              note={detail.payPlans.splitNote}
              selected={checkout.payPlan === "split"}
              onSelect={(plan) => checkout.actions.setPayPlan(plan)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Expand({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SummaryRow({
  label,
  value,
  action,
  onAction,
  children,
}: {
  label: string;
  value: string;
  action: string;
  onAction: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-neutral-100 py-3.5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-neutral-900">
            {label}
          </span>
          <span className="text-[12px] text-neutral-500">{value}</span>
        </div>
        <button
          type="button"
          onClick={onAction}
          className="rounded-full border border-neutral-200 px-3 py-1.5 text-[11px] font-medium text-neutral-700 active:bg-neutral-100"
        >
          {action}
        </button>
      </div>
      <Expand show={Boolean(children)}>{children}</Expand>
    </div>
  );
}

function StepperButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function PayTimingOption({
  plan,
  label,
  note,
  selected,
  onSelect,
}: {
  plan: CheckoutPayPlan;
  label: string;
  note?: string;
  selected: boolean;
  onSelect: (plan: CheckoutPayPlan) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(plan)}
      className={`flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
        selected ? "border-neutral-900" : "border-neutral-300"
      }`}
    >
      <span>
        <span className="block text-[13px] font-medium text-neutral-900">
          {label}
        </span>
        {note && (
          <span className="block pt-1 text-[11px] leading-relaxed text-neutral-500">
            {note}
          </span>
        )}
      </span>
      <span
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-neutral-900 bg-white" : "border-neutral-300 bg-white"}`}
      >
        {selected && (
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
        )}
      </span>
    </button>
  );
}
