"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Info } from "lucide-react";

const MANNER_TEMPERATURE = 36.5;

/** 매너온도 bar; the underlined label explains the score in place. */
export function MannerTemperature() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative mt-5">
      <div className="flex items-end justify-between">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-[13px] font-medium text-gray-700 underline decoration-gray-300 underline-offset-4 active:text-gray-900"
        >
          매너온도
          <Info className="h-3.5 w-3.5 text-gray-400" />
        </button>
        <span className="text-[15px] font-bold text-[#2db400]">
          {MANNER_TEMPERATURE}°C
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#8fd16a] to-[#2db400]"
          style={{ width: `${MANNER_TEMPERATURE}%` }}
        />
      </div>
      <AnimatePresence>
        {open ? (
          <motion.p
            role="note"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onClick={() => setOpen(false)}
            className="absolute left-0 top-full z-10 mt-2 w-[264px] rounded-lg bg-gray-900 px-3 py-2.5 text-[12px] leading-relaxed text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
          >
            이웃들이 남긴 칭찬과 거래 후기로 정해지는 매너 지표예요. 처음엔
            36.5°C에서 시작해요.
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
