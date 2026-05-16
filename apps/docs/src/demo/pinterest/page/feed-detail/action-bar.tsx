"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import type { PinDetail } from "@/demo/pinterest/state/pin";

export function ActionBar({ pin }: { pin: PinDetail }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(261);

  function toggleLike() {
    setLiked((v) => {
      const next = !v;
      setLikeCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <button
        type="button"
        onClick={toggleLike}
        className="flex items-center gap-1.5"
      >
        <Heart
          className={`h-7 w-7 ${liked ? "fill-red-500 text-red-500" : "text-white"}`}
          strokeWidth={2.2}
        />
        <span className="text-[14px] font-semibold text-white">
          {likeCount}
        </span>
      </button>
      <button type="button" aria-label="댓글" className="text-white">
        <MessageCircle className="h-6 w-6" strokeWidth={2.2} />
      </button>
      <button type="button" aria-label="공유" className="text-white">
        <Share2 className="h-6 w-6" strokeWidth={2.2} />
      </button>
      <button type="button" aria-label="더보기" className="text-white">
        <MoreHorizontal className="h-6 w-6" strokeWidth={2.2} />
      </button>
      <div className="flex-1" />
      <button
        type="button"
        className="rounded-full bg-[#E60023] px-5 py-2 text-[14px] font-semibold text-white"
      >
        저장
      </button>
      <span className="sr-only">{pin.saves} saves</span>
    </div>
  );
}
