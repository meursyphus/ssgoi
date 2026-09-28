"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useWishlist } from "@/demo/air-bnb/state/wishlist";

/**
 * Wishlist heart. Card variant sits on a photo (white outline, dark fill);
 * the round variant is the white button in the listing header.
 */
export function SaveButton({
  listingId,
  variant = "card",
  size = "sm",
  className = "",
}: {
  listingId: string;
  variant?: "card" | "round";
  /** Icon size of the card variant */
  size?: "sm" | "lg";
  className?: string;
}) {
  const wishlist = useWishlist((state) => ({
    savedIds: state.overview.data.savedIds,
    actions: state.actions,
  }));
  const saved = wishlist.savedIds.includes(listingId);
  // Pop only after a tap, not when a page mounts or the list loads.
  const [tapped, setTapped] = useState(false);
  useEffect(() => {
    wishlist.actions.load();
  }, [wishlist.actions]);

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      onClick={() => {
        setTapped(true);
        wishlist.actions.toggle(listingId);
      }}
      className={`flex items-center justify-center ${
        variant === "round"
          ? "h-9 w-9 rounded-full bg-white text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
          : size === "lg"
            ? "h-10 w-10"
            : "h-8 w-8"
      } ${className}`}
    >
      <motion.span
        key={saved ? "saved" : "unsaved"}
        initial={tapped ? { scale: saved ? 0.55 : 0.85 } : false}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 14 }}
        className="flex"
      >
        <Heart
          className={
            variant === "round"
              ? "h-4 w-4"
              : `${size === "lg" ? "h-6 w-6" : "h-5 w-5"} drop-shadow`
          }
          strokeWidth={variant === "round" ? 2 : 2.2}
          fill={
            saved
              ? "#FF385C"
              : variant === "round"
                ? "none"
                : "rgba(0,0,0,0.35)"
          }
          color={
            saved && variant === "round"
              ? "#FF385C"
              : variant === "round"
                ? "currentColor"
                : "white"
          }
        />
      </motion.span>
    </button>
  );
}
