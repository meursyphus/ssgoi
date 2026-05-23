"use client";

import { Bold, Italic, Underline, Link2, Smile } from "lucide-react";

export function ComposeToolbar() {
  return (
    <div className="flex items-center gap-1 border-t border-neutral-200/80 bg-white px-3 py-2">
      {[Bold, Italic, Underline, Link2, Smile].map((Icon, i) => (
        <button
          key={i}
          type="button"
          className="rounded-full p-2 text-neutral-600 active:bg-neutral-100"
          aria-label="Format"
        >
          <Icon size={18} strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
