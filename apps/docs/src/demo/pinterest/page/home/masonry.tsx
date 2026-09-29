"use client";

import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePin } from "@/demo/pinterest/state/pin";
import { PinGrid } from "../shared/pin-grid";

export function Masonry() {
  const pinState = usePin((state) => ({
    pins: state.pins,
    board: state.board,
  }));

  if (pinState.pins.isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    // Board tabs swap the feed with a short cross-fade; the first render
    // (including coming back from a pin) shows the grid as-is so the zoom
    // can find its tile.
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={pinState.board}
        className="px-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <PinGrid pins={pinState.pins.data} />
      </motion.div>
    </AnimatePresence>
  );
}
