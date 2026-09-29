"use client";

import { ChevronLeft } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";

export function InboxHeader() {
  return (
    <div className="sticky top-0 z-10 grid grid-cols-[40px_1fr_40px] items-center bg-white/95 px-2 pt-3 pb-2 backdrop-blur">
      <DemoBackLink
        fallback="/demo/pinterest"
        aria-label="뒤로"
        className="grid h-10 w-10 place-items-center text-black"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2.4} />
      </DemoBackLink>
      <h1 className="text-center text-[17px] font-bold text-black">
        받은 편지함
      </h1>
    </div>
  );
}
