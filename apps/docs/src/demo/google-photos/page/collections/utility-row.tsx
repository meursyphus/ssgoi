"use client";

import { Heart, Trash2, Film, Archive } from "lucide-react";

/**
 * 2x2 utility buttons at the top of the Collections tab. Favorites / Trash /
 * Videos / Archive. No handlers wired up — display only.
 */
const ITEMS = [
  { Icon: Heart, label: "Favorites" },
  { Icon: Trash2, label: "Trash" },
  { Icon: Film, label: "Videos" },
  { Icon: Archive, label: "Archive" },
] as const;

export function UtilityRow() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ITEMS.map(({ Icon, label }) => (
        <button
          key={label}
          type="button"
          className="flex items-center gap-3 rounded-full bg-neutral-100 px-4 py-3 text-left text-[13px] font-medium text-neutral-800 active:bg-neutral-200"
        >
          <Icon className="h-4 w-4 text-neutral-600" />
          {label}
        </button>
      ))}
    </div>
  );
}
