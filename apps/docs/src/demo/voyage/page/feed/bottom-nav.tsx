"use client";

import { Compass, Bookmark, Map, User } from "lucide-react";

const items = [
  { label: "Explore", icon: Compass, active: true },
  { label: "Saved", icon: Bookmark, active: false },
  { label: "Trips", icon: Map, active: false },
  { label: "Profile", icon: User, active: false },
];

export function BottomNav() {
  return (
    <nav className="grid grid-cols-4 border-t border-neutral-200/70 bg-white">
      {items.map(({ label, icon: Icon, active }) => (
        <button
          key={label}
          type="button"
          className="flex flex-col items-center gap-1 py-2.5"
        >
          <Icon
            size={22}
            strokeWidth={active ? 2.5 : 2}
            className={active ? "text-[#FF5A5F]" : "text-neutral-400"}
          />
          <span
            className={`text-[11px] ${
              active ? "font-semibold text-neutral-900" : "text-neutral-500"
            }`}
          >
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
