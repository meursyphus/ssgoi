"use client";

import { X, ChevronDown } from "lucide-react";
import type { PinDetail } from "@/demo/pinterest/state/pin";

export function VisitSite({ pin }: { pin: PinDetail }) {
  return (
    <div className="border-t border-black/5 bg-white">
      <div className="flex items-center gap-2 px-4 pt-3">
        <button
          type="button"
          aria-label="닫기"
          className="grid h-7 w-7 place-items-center text-neutral-700"
        >
          <X className="h-4 w-4" strokeWidth={2.4} />
        </button>
        <span className="flex-1 truncate text-[13px] text-neutral-700">
          {pin.domain}
        </span>
        <button
          type="button"
          aria-label="더보기"
          className="grid h-7 w-7 place-items-center text-neutral-700"
        >
          <ChevronDown className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
      <div className="px-4 pb-4 pt-2">
        <button
          type="button"
          className="w-full rounded-full bg-neutral-100 py-3 text-[15px] font-semibold text-black"
        >
          사이트 방문
        </button>
      </div>
    </div>
  );
}
