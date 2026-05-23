"use client";

import { useRouter } from "next/navigation";
import { LayoutGrid, Sparkles, Film, Play } from "lucide-react";

type Tool = {
  Icon: typeof LayoutGrid;
  label: string;
  bg: string;
  fg: string;
  href?: string;
};

const TOOLS: Tool[] = [
  {
    Icon: LayoutGrid,
    label: "Collage",
    bg: "bg-[#E8F0FE]",
    fg: "text-[#1A73E8]",
    href: "/demo/google-photos/collage",
  },
  {
    Icon: Sparkles,
    label: "Highlight video",
    bg: "bg-[#FCE8E6]",
    fg: "text-[#D93025]",
  },
  { Icon: Film, label: "Cinematic motion", bg: "bg-[#E6F4EA]", fg: "text-[#188038]" },
  { Icon: Play, label: "Animation", bg: "bg-[#FEF7E0]", fg: "text-[#B06000]" },
];

export function ToolGrid() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 gap-3">
      {TOOLS.map(({ Icon, label, bg, fg, href }) => {
        const enabled = Boolean(href);
        return (
          <button
            key={label}
            type="button"
            disabled={!enabled}
            onClick={enabled ? () => router.push(href!) : undefined}
            className={`relative flex flex-col items-start gap-3 rounded-2xl bg-neutral-50 p-4 text-left ${
              enabled
                ? "active:bg-neutral-100"
                : "cursor-not-allowed opacity-50"
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}
            >
              <Icon className={`h-5 w-5 ${fg}`} />
            </span>
            <span className="text-[13px] font-medium text-neutral-900">
              {label}
            </span>
            {!enabled && (
              <span className="absolute right-3 top-3 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                Soon
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
