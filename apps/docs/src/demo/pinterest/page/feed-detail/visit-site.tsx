"use client";

import { X, ChevronDown } from "lucide-react";
import type { PinDetail } from "@/demo/pinterest/state/pin";

export function VisitSite({ pin }: { pin: PinDetail }) {
  return (
    <div className="border-t border-white/5 bg-black">
      <div className="flex items-center gap-2 px-4 py-2">
        <button
          type="button"
          aria-label="닫기"
          className="grid h-7 w-7 place-items-center text-white"
        >
          <X className="h-4 w-4" strokeWidth={2.4} />
        </button>
        <span className="flex-1 truncate text-[12px] text-neutral-300">
          {pin.domain}
        </span>
        <button
          type="button"
          aria-label="더보기"
          className="grid h-7 w-7 place-items-center text-white"
        >
          <ChevronDown className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
      <div className="px-4 pb-4">
        <button
          type="button"
          className="w-full rounded-full bg-white py-3 text-[14px] font-semibold text-black"
        >
          사이트 방문
        </button>
      </div>
    </div>
  );
}
