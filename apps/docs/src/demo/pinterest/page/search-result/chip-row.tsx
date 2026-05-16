"use client";

type Chip = {
  label: string;
  thumb: string;
  tint: "pink" | "slate" | "lilac";
};

const CHIP_PRESETS: Record<string, Chip[]> = {
  "여자 치마": [
    { label: "코디", thumb: "/demo/pinterest/14-400x1000.jpg", tint: "pink" },
    {
      label: "겨울코디",
      thumb: "/demo/pinterest/21-400x533.jpg",
      tint: "slate",
    },
    { label: "정장", thumb: "/demo/pinterest/23-400x800.jpg", tint: "pink" },
    { label: "청자캐", thumb: "/demo/pinterest/17-400x667.jpg", tint: "pink" },
    { label: "데일리", thumb: "/demo/pinterest/15-400x800.jpg", tint: "lilac" },
    { label: "플리츠", thumb: "/demo/pinterest/12-400x800.jpg", tint: "slate" },
  ],
  만년필: [
    { label: "촉", thumb: "/demo/pinterest/11-400x667.jpg", tint: "slate" },
    { label: "잉크", thumb: "/demo/pinterest/20-400x800.jpg", tint: "pink" },
    { label: "스터디", thumb: "/demo/pinterest/19-400x667.jpg", tint: "slate" },
    { label: "필사", thumb: "/demo/pinterest/13-400x533.jpg", tint: "lilac" },
  ],
  "Study room decor": [
    { label: "조명", thumb: "/demo/pinterest/24-400x600.jpg", tint: "pink" },
    { label: "데스크", thumb: "/demo/pinterest/19-400x667.jpg", tint: "slate" },
    { label: "선반", thumb: "/demo/pinterest/21-400x533.jpg", tint: "lilac" },
    { label: "포스터", thumb: "/demo/pinterest/13-400x533.jpg", tint: "pink" },
  ],
  겨울코디: [
    { label: "코트", thumb: "/demo/pinterest/21-400x533.jpg", tint: "slate" },
    { label: "니트", thumb: "/demo/pinterest/12-400x800.jpg", tint: "pink" },
    { label: "롱부츠", thumb: "/demo/pinterest/23-400x800.jpg", tint: "lilac" },
    { label: "톤온톤", thumb: "/demo/pinterest/14-400x1000.jpg", tint: "pink" },
  ],
};

const FALLBACK: Chip[] = [
  { label: "인기", thumb: "/demo/pinterest/14-400x1000.jpg", tint: "pink" },
  { label: "최신", thumb: "/demo/pinterest/16-400x600.jpg", tint: "slate" },
  { label: "관련", thumb: "/demo/pinterest/22-400x1000.jpg", tint: "pink" },
];

const TINT_BG: Record<Chip["tint"], string> = {
  pink: "bg-[#FAD1D1]",
  slate: "bg-[#D6DAE3]",
  lilac: "bg-[#E3D6F0]",
};

export function ChipRow({ query }: { query: string }) {
  const chips = CHIP_PRESETS[query] ?? FALLBACK;
  return (
    <div className="bg-white">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-3 pb-3 pt-1">
        {chips.map((chip, i) => (
          <button
            key={`${chip.label}-${i}`}
            type="button"
            className={`flex h-12 flex-shrink-0 items-stretch overflow-hidden rounded-2xl ${TINT_BG[chip.tint]}`}
          >
            <img src={chip.thumb} alt="" className="h-full w-12 object-cover" />
            <span className="flex items-center px-4 text-[15px] font-bold text-black">
              {chip.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
