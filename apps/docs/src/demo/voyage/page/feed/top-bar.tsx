"use client";

import { Bell, Globe2 } from "lucide-react";

export function TopBar() {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 px-5 pt-5 pb-3 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5A5F] text-white">
          <Globe2 size={18} strokeWidth={2.5} />
        </span>
        <span className="text-[22px] font-extrabold tracking-tight text-neutral-900">
          Voyage
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="rounded-full p-2 text-neutral-700 active:bg-neutral-100"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={2.25} />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-[13px] font-semibold text-white">
          You
        </div>
      </div>
    </div>
  );
}
