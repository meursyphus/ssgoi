"use client";

import type { ReactNode } from "react";

/** Horizontal filter chips; the active chip is black (re-filters in place). */
export function ChipRow({
  items,
  value,
  onChange,
  leading,
  className = "",
}: {
  items: string[];
  value: string;
  onChange: (item: string) => void;
  leading?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={`scrollbar-hide flex gap-2 overflow-x-auto ${className}`}
    >
      {leading}
      {items.map((item) => {
        const active = item === value;
        return (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item)}
            className={`h-9 shrink-0 rounded-lg px-4 text-[14px] font-medium transition-colors duration-150 active:scale-95 ${
              active
                ? "bg-neutral-950 text-white"
                : "bg-neutral-100 text-neutral-900"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
