"use client";

import { Search } from "lucide-react";
import { Input } from "@/lib/components/ui/input";

export function FollowsSearch() {
  return (
    <div className="relative px-4 pt-3">
      <Search
        className="pointer-events-none absolute left-7 top-1/2 mt-1.5 h-4 w-4 -translate-y-1/2 text-neutral-500"
        strokeWidth={2}
      />
      <Input
        type="search"
        placeholder="검색"
        aria-label="검색"
        className="h-9 rounded-lg border-0 bg-neutral-100 pl-9 text-[14px] shadow-none placeholder:text-neutral-500 focus-visible:ring-0 md:text-[14px]"
      />
    </div>
  );
}
