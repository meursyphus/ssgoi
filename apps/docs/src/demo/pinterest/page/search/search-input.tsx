"use client";

import { Search, Camera } from "lucide-react";

export function SearchInput() {
  return (
    <div className="bg-black px-4 pt-4 pb-3">
      <div className="flex items-center gap-2 rounded-full bg-[#1e1e1e] px-4 py-2.5">
        <Search className="h-4 w-4 text-neutral-400" strokeWidth={2.4} />
        <input
          type="text"
          readOnly
          placeholder="Pinterest 검색"
          className="flex-1 bg-transparent text-[14px] text-white placeholder:text-neutral-500 outline-none"
        />
        <button
          type="button"
          aria-label="카메라"
          className="grid h-7 w-7 place-items-center text-white"
        >
          <Camera className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
