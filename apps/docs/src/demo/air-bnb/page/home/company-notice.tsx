"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const LINES = [
  "Airbnb Ireland UC, private unlimited company",
  "8 Hanover Quay, Dublin 2, D02 DP23, Ireland",
  "Airbnb acts as a platform intermediary and is not a party to the booking between hosts and guests.",
];

export function CompanyNotice() {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-4 pt-4">
      <div className="rounded-2xl border border-neutral-200">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        >
          <span className="text-[12px] text-neutral-500">
            Company details and terms of service
          </span>
          <ChevronDown
            className={`h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-1 px-4 pb-3.5 text-[11px] leading-relaxed text-neutral-500">
                {LINES.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
