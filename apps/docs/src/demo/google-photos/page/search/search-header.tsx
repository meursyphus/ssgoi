"use client";

import { ArrowLeft, X } from "lucide-react";
import { BASE } from "@/demo/google-photos/page/shared/paths";
import { DemoBackLink } from "@/lib/components/demo-back-link";

export function SearchHeader({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <header className="sticky top-0 z-20 bg-white px-3 pb-2 pt-3">
      <div className="flex h-12 items-center gap-1 rounded-full bg-neutral-100 pl-1 pr-2">
        <DemoBackLink
          fallback={BASE}
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-700 active:bg-black/[0.06]"
        >
          <ArrowLeft className="h-5 w-5" />
        </DemoBackLink>
        {/* 16px keeps iOS Safari from zooming the page on focus. */}
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search your photos"
          aria-label="Search your photos"
          enterKeyHint="search"
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-neutral-900 outline-none placeholder:text-neutral-500 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-600 active:bg-black/[0.06]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}
