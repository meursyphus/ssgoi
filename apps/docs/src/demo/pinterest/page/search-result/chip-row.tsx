"use client";

type Chip = {
  label: string;
  thumb: string;
  tint: "pink" | "slate" | "lilac";
};

const chip = (seed: string) =>
  `https://picsum.photos/seed/${seed}/96/96`;

const CHIP_PRESETS: Record<string, Chip[]> = {
  "여자 치마": [
    { label: "코디", thumb: chip("pinterest-pin-5"), tint: "pink" },
    { label: "겨울코디", thumb: chip("pinterest-pin-12"), tint: "slate" },
    { label: "정장", thumb: chip("pinterest-pin-14"), tint: "pink" },
    { label: "청자캐", thumb: chip("pinterest-pin-8"), tint: "pink" },
    { label: "데일리", thumb: chip("pinterest-pin-6"), tint: "lilac" },
    { label: "플리츠", thumb: chip("pinterest-pin-3"), tint: "slate" },
  ],
  만년필: [
    { label: "촉", thumb: chip("pinterest-pin-2"), tint: "slate" },
    { label: "잉크", thumb: chip("pinterest-pin-11"), tint: "pink" },
    { label: "스터디", thumb: chip("pinterest-pin-10"), tint: "slate" },
    { label: "필사", thumb: chip("pinterest-pin-4"), tint: "lilac" },
  ],
  "Study room decor": [
    { label: "조명", thumb: chip("pinterest-pin-15"), tint: "pink" },
    { label: "데스크", thumb: chip("pinterest-pin-10"), tint: "slate" },
    { label: "선반", thumb: chip("pinterest-pin-12"), tint: "lilac" },
    { label: "포스터", thumb: chip("pinterest-pin-4"), tint: "pink" },
  ],
  겨울코디: [
    { label: "코트", thumb: chip("pinterest-pin-12"), tint: "slate" },
    { label: "니트", thumb: chip("pinterest-pin-3"), tint: "pink" },
    { label: "롱부츠", thumb: chip("pinterest-pin-14"), tint: "lilac" },
    { label: "톤온톤", thumb: chip("pinterest-pin-5"), tint: "pink" },
  ],
};

const FALLBACK: Chip[] = [
  { label: "인기", thumb: chip("pinterest-pin-5"), tint: "pink" },
  { label: "최신", thumb: chip("pinterest-pin-7"), tint: "slate" },
  { label: "관련", thumb: chip("pinterest-pin-13"), tint: "pink" },
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
