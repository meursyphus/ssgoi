"use client";

import { RotateCw } from "lucide-react";

export function RefreshPill() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2">
      <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-lg">
        <RotateCw className="h-3.5 w-3.5 text-black" strokeWidth={2.4} />
        <span className="text-[12px] font-semibold text-black">
          피드 새로 고침
        </span>
      </div>
    </div>
  );
}
