"use client";

import { RotateCw } from "lucide-react";

export function RefreshPill() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1 z-10 -translate-x-1/2">
      <div className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
        <RotateCw className="h-4 w-4 text-black" strokeWidth={2.4} />
        <span className="text-[13px] font-semibold text-black">
          피드 새로 고침
        </span>
      </div>
    </div>
  );
}
