"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { ListingDetail } from "@/demo/air-bnb/state/listing";

export function PerksCard({ perks }: { perks: ListingDetail["perks"] }) {
  const [dismissed, setDismissed] = useState(false);
  const [added, setAdded] = useState(false);

  const toggleAdded = () => {
    setAdded((v) => !v);
    if (!added) toast.success(perks.addedLabel);
  };

  return (
    <AnimatePresence initial={false}>
      {!dismissed && (
        // The padding keeps the card shadow inside the clip while it collapses.
        <motion.div
          exit={{ opacity: 0, height: 0, paddingTop: 0 }}
          transition={{ duration: 0.26, ease: [0.2, 0, 0, 1] }}
          className="-mx-4 -mb-4 mt-1 overflow-hidden px-4 pt-4 pb-4"
        >
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_10px_28px_-14px_rgba(0,0,0,0.18)]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-neutral-900">
                  {perks.label}
                </p>
                <p className="pt-1 text-[12px] leading-relaxed text-neutral-600">
                  {perks.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="-m-1 p-1 text-neutral-400 active:text-neutral-700"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              aria-pressed={added}
              onClick={toggleAdded}
              className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-medium transition-colors active:scale-[0.99] ${
                added
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-neutral-100 text-neutral-700"
              }`}
            >
              {added && <Check className="h-3.5 w-3.5" strokeWidth={2.6} />}
              {added ? perks.addedLabel : perks.actionLabel}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
