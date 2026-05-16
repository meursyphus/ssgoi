"use client";

import { useState } from "react";

const CHIP_PRESETS: Record<string, string[]> = {
  "여자 치마": [
    "코디",
    "겨울코디",
    "정장",
    "청자대",
    "데일리",
    "플리츠",
    "여름",
  ],
  만년필: ["촉", "잉크", "스터디", "필사", "스케치", "데스크"],
  "Study room decor": ["조명", "데스크", "선반", "포스터", "북엔드"],
  겨울코디: ["코트", "니트", "롱부츠", "머플러", "톤온톤"],
};

const FALLBACK = ["인기", "최신", "관련", "추천"];

export function ChipRow({ query }: { query: string }) {
  const chips = CHIP_PRESETS[query] ?? FALLBACK;
  const [active, setActive] = useState(-1);
  return (
    <div className="border-b border-white/5 bg-black">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-3 py-2.5">
        {chips.map((chip, i) => (
          <button
            key={chip}
            type="button"
            onClick={() => setActive((v) => (v === i ? -1 : i))}
            className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              active === i ? "bg-white text-black" : "bg-neutral-800 text-white"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
