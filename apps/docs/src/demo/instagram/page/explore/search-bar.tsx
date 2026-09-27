"use client";

import { Search } from "lucide-react";
import { Input } from "@/lib/components/ui/input";

export function ExploreSearchBar() {
  return (
    <div className="sticky top-0 z-20 bg-white px-3 pb-2 pt-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
          strokeWidth={2}
        />
        <Input
          type="search"
          placeholder="검색"
          aria-label="검색"
          className="h-9 rounded-xl border-0 bg-neutral-100 pl-9 text-[15px] shadow-none placeholder:text-neutral-500 focus-visible:ring-0 md:text-[15px]"
        />
      </div>
    </div>
  );
}
