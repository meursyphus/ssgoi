"use client";

import { ChevronLeft } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";

export function BackButton() {
  return (
    <DemoBackLink
      fallback="/demo/pinterest"
      aria-label="뒤로"
      className="absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-black shadow-[0_2px_8px_rgba(0,0,0,0.18)] backdrop-blur"
    >
      <ChevronLeft className="h-5 w-5" strokeWidth={2.6} />
    </DemoBackLink>
  );
}
