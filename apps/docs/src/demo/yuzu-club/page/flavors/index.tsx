"use client";

import { Link } from "@/lib/link";
type Flavor = {
  emoji: string;
  name: string;
  note: string;
  tag: string;
  bg: string;
  rotate: string;
};
const FLAVORS: Flavor[] = [
  {
    emoji: "🍊",
    name: "Yuzu OG",
    note: "The one that started it",
    tag: "Classic",
    bg: "bg-[#ffd23f]",
    rotate: "-rotate-2",
  },
  {
    emoji: "🍋",
    name: "Lemon Snap",
    note: "Sour enough to wake the dog",
    tag: "Sour",
    bg: "bg-[#fff5d6]",
    rotate: "rotate-2",
  },
  {
    emoji: "🍑",
    name: "Peach Float",
    note: "Cream-soda nostalgia",
    tag: "Sweet",
    bg: "bg-[#ffd2a4]",
    rotate: "-rotate-1",
  },
  {
    emoji: "🌿",
    name: "Mint Coast",
    note: "Cool. Then cooler.",
    tag: "Cool",
    bg: "bg-[#8ed1a4]",
    rotate: "rotate-1",
  },
  {
    emoji: "🥭",
    name: "Mango Glow",
    note: "Tropical without the airfare",
    tag: "Tropical",
    bg: "bg-[#ff7a45]",
    rotate: "-rotate-2",
  },
  {
    emoji: "🫐",
    name: "Berry Burst",
    note: "Cousin of the citrus, invited anyway",
    tag: "Berry",
    bg: "bg-[#c9a4f5]",
    rotate: "rotate-2",
  },
];
export default function FlavorsPage() {
  return (
    <div
      data-ssgoi-transition="/demo/yuzu-club/flavors"
      className="relative h-full w-full"
    >
      <div className="relative h-full w-full overflow-y-auto bg-[#8ed1a4]">
        <span
          aria-hidden
          className="pointer-events-none absolute top-[12%] right-[10%] size-28 rotate-12 rounded-full bg-[#ffd23f]/65 blur-sm"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[14%] left-[6%] size-36 -rotate-6 rounded-[42%] bg-[#ff7a45]/40 blur-sm"
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20 lg:px-10 lg:pt-36">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1a1a2e] px-4 py-1.5 text-[10px] font-bold tracking-[0.32em] text-[#fff5d6] uppercase">
              Roster · 06 Flavors
            </span>
            <h1 className="mt-6 text-[clamp(2.4rem,7vw,5rem)] leading-[0.95] font-black tracking-tight">
              Meet the lineup
              <span aria-hidden className="ml-2 inline-block -rotate-6">
                ✦
              </span>
            </h1>
            <p className="mt-4 max-w-md text-base text-[#1a1a2e]/80">
              Every box comes with three. You vote, we rotate. Last one in gets
              cut from the team.
            </p>
          </div>

          <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FLAVORS.map((f) => (
              <li
                key={f.name}
                className={`group relative overflow-hidden rounded-[28px] ring-2 ring-[#1a1a2e] ${f.bg} ${f.rotate} transition-transform duration-300 hover:rotate-0 hover:scale-[1.02]`}
              >
                <div className="flex flex-col gap-3 px-6 py-7">
                  <div className="flex items-start justify-between">
                    <span aria-hidden className="text-5xl">
                      {f.emoji}
                    </span>
                    <span className="rounded-full bg-[#1a1a2e] px-3 py-1 text-[9px] font-bold tracking-[0.24em] text-[#fff5d6] uppercase">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">
                    {f.name}
                  </h3>
                  <p className="text-sm text-[#1a1a2e]/75">{f.note}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex flex-col items-center gap-3">
            <Link
              href="/demo/yuzu-club"
              className="rounded-full bg-[#1a1a2e] px-7 py-3 text-sm font-bold text-[#fff5d6] transition hover:bg-[#2a2a4a]"
            >
              ← Back to the Squeeze
            </Link>
            <p className="text-[10px] font-bold tracking-[0.32em] text-[#1a1a2e]/55 uppercase">
              Drop No. 14 ships Monday
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
