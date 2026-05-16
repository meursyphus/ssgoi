"use client";

import { Search, Camera } from "lucide-react";

export function SearchInput() {
  return (
    <div className="bg-white px-4 pt-3 pb-3">
      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
        <Search className="h-4 w-4 text-black" strokeWidth={2.6} />
        <input
          type="text"
          readOnly
          placeholder="Pinterest 검색"
          className="flex-1 bg-transparent text-[15px] text-black placeholder:text-neutral-500 outline-none"
        />
        <button
          type="button"
          aria-label="카메라"
          className="grid h-7 w-7 place-items-center text-black"
        >
          <Camera className="h-5 w-5" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
