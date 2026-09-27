"use client";

import { motion } from "motion/react";

const FRAME_SECONDS = 5;

export function StoryProgress({
  count,
  index,
  runKey,
  onComplete,
}: {
  count: number;
  index: number;
  runKey: string;
  onComplete: () => void;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/35"
        >
          {i === index ? (
            <motion.div
              key={runKey}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: FRAME_SECONDS, ease: "linear" }}
              onAnimationComplete={onComplete}
              className="h-full origin-left bg-white"
            />
          ) : (
            <div
              className={`h-full origin-left bg-white ${
                i < index ? "scale-x-100" : "scale-x-0"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
