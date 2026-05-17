"use client";

import { useState } from "react";

const TABS = ["모두", "멋진 발명품", "Study room decor", "만년필"];

export function TabBar() {
  const [active, setActive] = useState(0);
  return (
    <div className="bg-white">
      <div className="scrollbar-hide flex gap-5 overflow-x-auto px-4 pt-1 pb-2">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(i)}
            className={`relative flex-shrink-0 py-2 text-[15px] transition-colors ${
              active === i
                ? "font-bold text-black"
                : "font-medium text-neutral-500"
            }`}
          >
            {tab}
            {active === i && (
              <span className="absolute -bottom-0 left-0 right-0 h-[3px] rounded-full bg-black" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
