"use client";

import { Link } from "@/lib/link";
import type { Reel } from "@/demo/instagram/state/post";

export function ReelItem({ reel }: { reel: Reel }) {
  return (
    <Link
      href={`/demo/instagram/reels/${reel.id}`}
      scroll={false}
      className="relative block aspect-[9/16] overflow-hidden"
    >
      <img
        src={reel.image}
        alt="reel"
        width={400}
        height={700}
        className="h-full w-full object-cover"
        data-zoom-exit-key={reel.id}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/55 to-transparent px-1.5 py-1.5 text-[11px] text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7-11-7z" />
        </svg>
        <span>{reel.viewsLabel}</span>
      </div>
    </Link>
  );
}
