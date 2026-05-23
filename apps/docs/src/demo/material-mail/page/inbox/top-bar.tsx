"use client";

import { Menu, Search } from "lucide-react";

export function TopBar() {
  return (
    <div className="sticky top-0 z-10 px-4 pt-4 pb-3 bg-[#FAFAFE]">
      <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.04)]">
        <button
          type="button"
          className="-ml-1.5 rounded-full p-1.5 text-neutral-700 active:bg-neutral-100"
          aria-label="Menu"
        >
          <Menu size={20} strokeWidth={2.25} />
        </button>
        <div className="flex flex-1 items-center gap-2 text-[15px] text-neutral-500">
          <Search size={18} strokeWidth={2.25} />
          <span>Search in mail</span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-[13px] font-semibold text-white">
          M
        </div>
      </div>
    </div>
  );
}
