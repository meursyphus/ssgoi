"use client";

import { Mail, Video, MessageCircle, Hash } from "lucide-react";

const items = [
  { label: "Mail", icon: Mail, active: true },
  { label: "Meet", icon: Video, active: false },
  { label: "Chat", icon: MessageCircle, active: false },
  { label: "Spaces", icon: Hash, active: false },
];

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 grid grid-cols-4 border-t border-neutral-200/70 bg-white">
      {items.map(({ label, icon: Icon, active }) => (
        <button
          key={label}
          type="button"
          className="flex flex-col items-center gap-1 py-2.5"
        >
          <span
            className={`flex h-7 items-center justify-center rounded-full px-4 transition ${
              active ? "bg-indigo-100 text-indigo-700" : "text-neutral-500"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.25 : 2} />
          </span>
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
