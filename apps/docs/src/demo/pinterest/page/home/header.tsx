"use client";

import { Plus, MessageCircle } from "lucide-react";

export function HomeHeader() {
  return (
    <div className="sticky top-0 z-1 bg-white/95 backdrop-blur">
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <PinterestWordmark />
        <div className="flex-1" />
        <button
          type="button"
          aria-label="추가"
          className="grid h-9 w-9 place-items-center text-black"
        >
          <Plus className="h-7 w-7" strokeWidth={2.6} />
        </button>
        <button
          type="button"
          aria-label="메시지"
          className="relative grid h-9 w-9 place-items-center text-black"
        >
          <MessageCircle className="h-6 w-6" strokeWidth={2.4} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
      </div>
    </div>
  );
}

function PinterestWordmark() {
  return (
    <div className="flex items-center gap-1">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-[#E60023]"
      >
        <path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.43.04-3.48.22-.95 1.4-6.07 1.4-6.07s-.36-.72-.36-1.78c0-1.66.97-2.91 2.18-2.91 1.03 0 1.52.77 1.52 1.69 0 1.03-.65 2.56-.99 3.99-.28 1.18.6 2.15 1.77 2.15 2.12 0 3.76-2.24 3.76-5.47 0-2.86-2.06-4.86-5-4.86-3.4 0-5.4 2.55-5.4 5.19 0 1.03.4 2.13.89 2.73.1.12.11.22.08.34l-.33 1.34c-.05.22-.17.27-.4.16-1.5-.7-2.43-2.88-2.43-4.63 0-3.77 2.74-7.23 7.9-7.23 4.15 0 7.37 2.96 7.37 6.91 0 4.12-2.6 7.44-6.21 7.44-1.21 0-2.35-.63-2.74-1.37l-.75 2.84c-.27 1.04-1 2.35-1.49 3.15A12 12 0 1 0 12 0z" />
      </svg>
      <span className="text-[24px] font-bold tracking-tight text-[#E60023]">
        Pinterest
      </span>
    </div>
  );
}
