"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/** 토글이 켜질 때만 튀어 오르는 작은 pop (좋아요·저장 공통). */
export function Pop({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <motion.span
      key={on ? "on" : "off"}
      initial={on ? { scale: 0.55 } : false}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 14 }}
      className="flex"
    >
      {children}
    </motion.span>
  );
}
