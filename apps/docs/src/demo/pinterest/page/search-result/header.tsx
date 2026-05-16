"use client";

import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";

export function ResultHeader({ query }: { query: string }) {
  return (
    <div className="sticky top-0 z-10 bg-black/95 backdrop-blur">
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <Link
          href="/demo/pinterest/search"
          aria-label="뒤로"
          className="grid h-9 w-9 place-items-center text-white"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.4} />
        </Link>
        <div className="flex flex-1 items-center gap-2 rounded-full bg-[#1e1e1e] px-4 py-2">
          <input
            type="text"
            readOnly
            value={query}
            className="flex-1 bg-transparent text-[14px] font-medium text-white outline-none"
          />
        </div>
        <button
          type="button"
          aria-label="필터"
          className="grid h-9 w-9 place-items-center text-white"
        >
          <SlidersHorizontal className="h-5 w-5" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
