"use client";

const CHIPS = [
  "에너지 충전",
  "운동",
  "K-Pop",
  "팟캐스트",
  "Feel Good",
  "릴렉스",
  "출퇴근",
  "포커스",
  "파티",
  "Rock",
];

export function ChipBar() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CHIPS.map((label, i) => (
        <button
          key={label}
          type="button"
          className={[
            "h-9 shrink-0 rounded-md border px-4 text-[13px] font-medium transition-colors",
            i === 0
              ? "border-white bg-white text-black"
              : "border-white/15 bg-white/[0.04] text-white/85 hover:bg-white/10",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
