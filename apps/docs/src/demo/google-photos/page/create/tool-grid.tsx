"use client";

import { LayoutGrid, Sparkles, Film, Play } from "lucide-react";

const TOOLS = [
  { Icon: LayoutGrid, label: "Collage", bg: "bg-[#E8F0FE]", fg: "text-[#1A73E8]" },
  {
    Icon: Sparkles,
    label: "Highlight video",
    bg: "bg-[#FCE8E6]",
    fg: "text-[#D93025]",
  },
  { Icon: Film, label: "Cinematic motion", bg: "bg-[#E6F4EA]", fg: "text-[#188038]" },
  { Icon: Play, label: "Animation", bg: "bg-[#FEF7E0]", fg: "text-[#B06000]" },
] as const;

export function ToolGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TOOLS.map(({ Icon, label, bg, fg }) => (
        <button
          key={label}
          type="button"
          className="flex flex-col items-start gap-3 rounded-2xl bg-neutral-50 p-4 text-left active:bg-neutral-100"
        >
          <span className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}>
            <Icon className={`h-5 w-5 ${fg}`} />
          </span>
          <span className="text-[13px] font-medium text-neutral-900">{label}</span>
        </button>
      ))}
    </div>
  );
}
