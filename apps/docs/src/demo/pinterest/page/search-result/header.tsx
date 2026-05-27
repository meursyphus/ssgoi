"use client";

import { Link } from "@/lib/link";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";

export function ResultHeader({ query }: { query: string }) {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur">
      <div className="flex items-center gap-1 px-2 pt-3 pb-3">
        <Link
          href="/demo/pinterest/search"
          aria-label="뒤로"
          className="grid h-10 w-10 place-items-center text-black"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.4} />
        </Link>
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
          <input
            type="text"
            readOnly
            value={query}
            className="flex-1 bg-transparent text-[15px] font-medium text-black outline-none"
          />
        </div>
        <button
          type="button"
          aria-label="필터"
          className="grid h-10 w-10 place-items-center text-black"
        >
          <SlidersHorizontal className="h-5 w-5" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
