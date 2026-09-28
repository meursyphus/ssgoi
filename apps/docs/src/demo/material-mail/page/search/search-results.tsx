"use client";

import { SearchX } from "lucide-react";
import { useMail } from "@/demo/material-mail/state/mail";
import { MailCard } from "../shared/mail-card";

export function SearchResults() {
  const mail = useMail((s) => ({
    results: s.results,
    searchQuery: s.searchQuery,
  }));

  if (mail.results.isSuccess && mail.results.data.length === 0) {
    return (
      <div className="flex flex-col items-center px-8 pt-20 text-center">
        <SearchX size={40} strokeWidth={1.6} className="text-neutral-400" />
        <p className="mt-4 text-[15px] text-neutral-700">
          No results for “{mail.searchQuery.trim()}”
        </p>
      </div>
    );
  }

  return (
    <section className="pt-2 pb-safe">
      <h2 className="px-4 pb-1 text-[13px] font-medium text-neutral-500">
        Results in all mail
      </h2>
      <ul className="flex flex-col">
        {mail.results.data.map((m) => (
          <MailCard key={m.id} item={m} />
        ))}
      </ul>
    </section>
  );
}
