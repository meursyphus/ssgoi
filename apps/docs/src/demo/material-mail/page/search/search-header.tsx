"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, X } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { Input } from "@/lib/components/ui/input";
import { useMail } from "@/demo/material-mail/state/mail";

const BASE = "/demo/material-mail";

export function SearchHeader() {
  const mail = useMail((s) => ({
    searchQuery: s.searchQuery,
    actions: s.actions,
  }));
  const input = useRef<HTMLInputElement>(null);
  const openedWithQuery = useRef(mail.searchQuery !== "");

  // A fresh search raises the keyboard; coming back from a result keeps the
  // results in view instead. preventScroll: the page is still transitioning.
  useEffect(() => {
    if (!openedWithQuery.current) input.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="sticky top-0 z-10 flex h-16 items-center gap-1 border-b border-neutral-200 bg-white px-2">
      <DemoBackLink
        fallback={BASE}
        className="rounded-full p-2.5 text-neutral-700 active:bg-neutral-100"
        aria-label="Back"
      >
        <ArrowLeft size={22} strokeWidth={2.25} />
      </DemoBackLink>
      <Input
        ref={input}
        type="search"
        value={mail.searchQuery}
        onChange={(e) => void mail.actions.setSearchQuery(e.target.value)}
        placeholder="Search in mail"
        aria-label="Search in mail"
        className="h-12 flex-1 border-0 px-1 text-[16px] text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:ring-0 md:text-[16px] [&::-webkit-search-cancel-button]:hidden"
      />
      {mail.searchQuery && (
        <button
          type="button"
          onClick={() => {
            void mail.actions.setSearchQuery("");
            input.current?.focus({ preventScroll: true });
          }}
          className="rounded-full p-2.5 text-neutral-600 active:bg-neutral-100"
          aria-label="Clear search"
        >
          <X size={20} strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}
