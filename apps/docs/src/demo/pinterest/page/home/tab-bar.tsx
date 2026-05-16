"use client";

import { useState } from "react";

const TABS = ["모두", "멋진 발명품", "Study room decor", "만년필"];

export function TabBar() {
  const [active, setActive] = useState(0);
  return (
    <div className="bg-black border-b border-white/5">
      <div className="scrollbar-hide flex gap-5 overflow-x-auto px-4 py-2">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(i)}
            className={`relative flex-shrink-0 py-1.5 text-[14px] transition-colors ${
              active === i
                ? "font-bold text-white"
                : "font-medium text-neutral-400"
            }`}
          >
            {tab}
            {active === i && (
              <span className="absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full bg-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
