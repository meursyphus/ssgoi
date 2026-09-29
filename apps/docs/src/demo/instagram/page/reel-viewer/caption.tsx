"use client";

import { useState } from "react";
import { Music2 } from "lucide-react";
import type { ReelDetail } from "@/demo/instagram/state/post";

export function ReelCaption({ reel }: { reel: ReelDetail }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="min-w-0 flex-1 pb-1 drop-shadow">
      <div className="flex items-center gap-2">
        <img
          src={reel.author.avatar}
          alt={reel.author.username}
          className="h-8 w-8 rounded-full border border-white/40 object-cover"
        />
        <span className="text-[14px] font-semibold">
          {reel.author.username}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={`mt-2 block text-left text-[14px] leading-snug ${
          expanded ? "" : "line-clamp-1"
        }`}
      >
        {reel.caption}
      </button>
      <div className="mt-2 flex items-center gap-1.5 text-[13px]">
        <Music2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        <span className="truncate">{reel.audioLabel}</span>
      </div>
    </div>
  );
}
