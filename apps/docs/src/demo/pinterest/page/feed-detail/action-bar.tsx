"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Link } from "@/lib/link";
import { usePin, type PinDetail } from "@/demo/pinterest/state/pin";

export function ActionBar({ pin }: { pin: PinDetail }) {
  const pinState = usePin((state) => ({
    saved: state.saved,
    unsavedIds: state.unsavedIds,
    actions: state.actions,
  }));
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(261);
  const saved =
    pinState.saved.data.some((item) => item.id === pin.id) &&
    !pinState.unsavedIds.includes(pin.id);
  const shareHref = `/demo/pinterest/feed/${pin.id}/share`;

  function toggleLike() {
    setLiked((v) => {
      const next = !v;
      setLikeCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <button
        type="button"
        onClick={toggleLike}
        className="flex items-center gap-1.5"
      >
        <Heart
          className={`h-7 w-7 ${liked ? "fill-[#E60023] text-[#E60023]" : "text-black"}`}
          strokeWidth={2.2}
        />
        <span className="text-[15px] font-semibold text-black">
          {likeCount}
        </span>
      </button>
      <button type="button" aria-label="댓글" className="text-black">
        <MessageCircle className="h-7 w-7" strokeWidth={2.2} />
      </button>
      <Link
        href={shareHref}
        scroll={false}
        aria-label="공유"
        className="text-black"
      >
        <Share2 className="h-7 w-7" strokeWidth={2.2} />
      </Link>
      <Link
        href={shareHref}
        scroll={false}
        aria-label="더보기"
        className="text-black"
      >
        <MoreHorizontal className="h-7 w-7" strokeWidth={2.2} />
      </Link>
      <div className="flex-1" />
      <motion.button
        type="button"
        onClick={() => pinState.actions.toggleSave()}
        aria-pressed={saved}
        whileTap={{ scale: 0.92 }}
        className={`rounded-full px-5 py-2 text-[15px] font-semibold text-white transition-colors ${
          saved ? "bg-black" : "bg-[#E60023]"
        }`}
      >
        {saved ? "저장됨" : "저장"}
      </motion.button>
      <span className="sr-only">{pin.saves} saves</span>
    </div>
  );
}
