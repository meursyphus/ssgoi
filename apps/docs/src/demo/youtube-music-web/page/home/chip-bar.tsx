"use client";

const CHIPS = [
  "Podcasts",
  "Workout",
  "Feel good",
  "Relax",
  "Energize",
  "Romance",
  "Sad",
  "Focus",
  "Party",
  "Commute",
];

export function ChipBar() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CHIPS.map((label) => (
        <button
          key={label}
          type="button"
          className="h-9 shrink-0 rounded-md border border-white/[0.08] bg-white/[0.04] px-4 text-[13px] font-medium text-white/85 transition-colors hover:bg-white/[0.1]"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
