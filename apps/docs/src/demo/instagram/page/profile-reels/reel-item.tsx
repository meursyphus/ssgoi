"use client";

import type { Reel } from "@/demo/instagram/state/post";

export function ReelItem({ reel }: { reel: Reel }) {
  return (
    <div className="relative aspect-[9/16] overflow-hidden">
      <img src={reel.image} alt="reel" className="h-full w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/55 to-transparent px-1.5 py-1.5 text-[11px] text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7-11-7z" />
        </svg>
        <span>{reel.viewsLabel}</span>
      </div>
    </div>
  );
}
