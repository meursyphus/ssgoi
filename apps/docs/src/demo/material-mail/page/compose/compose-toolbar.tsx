"use client";

import {
  Bold,
  Italic,
  Underline,
  Link2,
  Smile,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

export type Formats = { bold: boolean; italic: boolean; underline: boolean };

const TOGGLES: { key: keyof Formats; label: string; icon: LucideIcon }[] = [
  { key: "bold", label: "Bold", icon: Bold },
  { key: "italic", label: "Italic", icon: Italic },
  { key: "underline", label: "Underline", icon: Underline },
];

const BUTTON = "rounded-full p-2 transition-colors";

export function ComposeToolbar({
  formats,
  onToggle,
}: {
  formats: Formats;
  onToggle: (key: keyof Formats) => void;
}) {
  return (
    <div className="sticky bottom-0 z-10 flex items-center gap-1 border-t border-neutral-200/80 bg-white px-3 py-2">
      {TOGGLES.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onToggle(key)}
          aria-pressed={formats[key]}
          aria-label={label}
          className={`${BUTTON} ${
            formats[key]
              ? "bg-indigo-100 text-indigo-700"
              : "text-neutral-600 active:bg-neutral-100"
          }`}
        >
          <Icon size={18} strokeWidth={formats[key] ? 2.5 : 2} />
        </button>
      ))}
      <button
        type="button"
        onClick={() => toast("Insert link is mocked in this demo")}
        className={`${BUTTON} text-neutral-600 active:bg-neutral-100`}
        aria-label="Insert link"
      >
        <Link2 size={18} strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => toast("Emoji picker is mocked in this demo")}
        className={`${BUTTON} text-neutral-600 active:bg-neutral-100`}
        aria-label="Emoji"
      >
        <Smile size={18} strokeWidth={2} />
      </button>
    </div>
  );
}
