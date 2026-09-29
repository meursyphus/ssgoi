"use client";

import { Clock, ArrowUpLeft } from "lucide-react";
import { useMail } from "@/demo/material-mail/state/mail";

const RECENT = ["receipts", "launch checklist", "Q2 roadmap", "maintenance"];

export function RecentSearches() {
  const mail = useMail((s) => ({ actions: s.actions }));
  return (
    <section className="pt-3">
      <h2 className="px-5 pb-1 text-[13px] font-medium text-neutral-500">
        Recent searches
      </h2>
      <ul>
        {RECENT.map((term) => (
          <li key={term}>
            <button
              type="button"
              onClick={() => void mail.actions.setSearchQuery(term)}
              className="flex h-12 w-full items-center gap-4 px-5 text-left text-[15px] text-neutral-800 active:bg-neutral-100"
            >
              <Clock size={20} strokeWidth={2} className="text-neutral-500" />
              <span className="flex-1">{term}</span>
              <ArrowUpLeft
                size={18}
                strokeWidth={2}
                className="text-neutral-400"
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
