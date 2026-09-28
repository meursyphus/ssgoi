"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Bell, BellOff, Star } from "lucide-react";

/** 서랍 하단 — 알림/즐겨찾기는 제자리 토글 */
export function DrawerToggles({
  muted,
  pinned,
}: {
  muted: boolean;
  pinned: boolean;
}) {
  const [isMuted, setMuted] = useState(muted);
  const [isFavorite, setFavorite] = useState(pinned);
  return (
    <div className="sticky bottom-0 z-10 grid grid-cols-2 border-t border-black/5 bg-white pb-safe">
      <ToggleButton
        label={isMuted ? "알림 꺼짐" : "알림 켜짐"}
        pressed={!isMuted}
        onClick={() => setMuted((v) => !v)}
      >
        {isMuted ? (
          <BellOff className="h-5 w-5" strokeWidth={1.8} />
        ) : (
          <Bell className="h-5 w-5" strokeWidth={1.8} />
        )}
      </ToggleButton>
      <ToggleButton
        label="즐겨찾기"
        pressed={isFavorite}
        onClick={() => setFavorite((v) => !v)}
      >
        <Star
          className={`h-5 w-5 ${isFavorite ? "fill-[#FEE500] text-[#E5B800]" : ""}`}
          strokeWidth={1.8}
        />
      </ToggleButton>
    </div>
  );
}

function ToggleButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [taps, setTaps] = useState(0);
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => {
        setTaps((n) => n + 1);
        onClick();
      }}
      className="flex h-16 flex-col items-center justify-center gap-1 text-neutral-700 active:bg-black/[0.03]"
    >
      <motion.span
        key={taps}
        initial={taps === 0 ? false : { scale: 0.75 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 16 }}
        className="flex"
      >
        {children}
      </motion.span>
      <span className="text-[11px]">{label}</span>
    </button>
  );
}
