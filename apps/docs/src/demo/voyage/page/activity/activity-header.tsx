"use client";

import { ChevronLeft } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { BASE } from "../shared/routes";

export function ActivityHeader() {
  // Only the feed's bell opens Activity, so the feed is the fallback; leaving
  // the `on` scope drills backward on direct entry too.
  return (
    <div className="sticky top-0 z-10 flex items-center gap-1 border-b border-neutral-200/80 bg-white/95 px-2 py-2.5 backdrop-blur-sm">
      <DemoBackLink
        fallback={BASE}
        aria-label="Back"
        className="rounded-full p-2 text-neutral-700 active:bg-neutral-100"
      >
        <ChevronLeft size={22} strokeWidth={2.25} />
      </DemoBackLink>
      <h1 className="flex-1 px-1 text-[16px] font-semibold text-neutral-900">
        Activity
      </h1>
    </div>
  );
}
