"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";

/** In-place favorite toggle — same pill style as the Back button. */
export function FavoriteButton({ initial }: { initial: boolean }) {
  const [favorite, setFavorite] = useState(initial);
  const [taps, setTaps] = useState(0);
  return (
    <button
      type="button"
      onClick={() => {
        setFavorite((v) => !v);
        setTaps((n) => n + 1);
      }}
      aria-pressed={favorite}
      aria-label={favorite ? "Remove from Favorites" : "Add to Favorites"}
      className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-black/5 backdrop-blur active:bg-white"
    >
      <motion.span
        key={taps}
        initial={taps === 0 ? false : { scale: favorite ? 0.5 : 0.85 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 16 }}
        className="flex"
      >
        <Heart
          className={`h-5 w-5 ${favorite ? "fill-current" : ""}`}
          strokeWidth={favorite ? 2 : 2.25}
        />
      </motion.span>
    </button>
  );
}
