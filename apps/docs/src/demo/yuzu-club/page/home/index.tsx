"use client";

import { Link } from "@/lib/link";
const STATS = [
  {
    value: "12",
    label: "Flavors",
  },
  {
    value: "8K",
    label: "Members",
  },
  {
    value: "4.9",
    label: "Rating",
  },
];
export default function HomePage() {
  return (
    <div className="relative h-full w-full">
      <div className="relative h-full w-full overflow-y-auto bg-[#ffd2a4]">
        {/* floating shapes */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-[18%] left-[8%] size-24 rotate-12 rounded-full bg-[#ff7a45]/35 blur-sm"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-[60%] right-[6%] size-32 -rotate-12 rounded-[40%] bg-[#8ed1a4]/45 blur-sm"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[8%] left-[14%] size-16 rotate-6 rounded-full bg-[#ffd23f]/70 blur-sm"
        />

        <div className="relative mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 pt-28 pb-24 lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1a1a2e] px-4 py-1.5 text-[10px] font-bold tracking-[0.32em] text-[#fff5d6] uppercase">
            <span className="size-1.5 rounded-full bg-[#8ed1a4]" />
            Drop No. 14 · Out Now
          </span>

          <h1 className="mt-7 text-center text-[clamp(2.8rem,9vw,6.5rem)] leading-[0.92] font-black tracking-tight">
            Snack like
            <br />
            you mean it.
            <span aria-hidden className="ml-2 inline-block rotate-12">
              🍊
            </span>
          </h1>

          <p className="mt-6 max-w-md text-center text-base leading-relaxed text-[#1a1a2e]/75">
            A monthly box of citrus-y snacks, hand-picked by people who think
            yuzu is a personality trait. Bright. Tangy. Frankly unserious.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/demo/yuzu-club/flavors"
              className="rounded-full bg-[#1a1a2e] px-6 py-3 text-sm font-bold text-[#fff5d6] transition hover:bg-[#2a2a4a]"
            >
              Meet the Flavors →
            </Link>
            <Link
              href="/demo/yuzu-club/flavors"
              className="rounded-full border-2 border-[#1a1a2e] px-6 py-3 text-sm font-bold text-[#1a1a2e] transition hover:bg-[#1a1a2e] hover:text-[#fff5d6]"
            >
              How the Box Works
            </Link>
          </div>

          {/* stat trio cards */}
          <div className="mt-14 grid grid-cols-3 gap-3 sm:gap-5">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center rounded-3xl px-6 py-5 ring-2 ring-[#1a1a2e] sm:px-8 ${i === 0 ? "bg-[#ffd23f] -rotate-2" : i === 1 ? "bg-[#8ed1a4] rotate-1" : "bg-[#fff5d6] -rotate-1"}`}
              >
                <span className="text-3xl font-black sm:text-4xl">
                  {s.value}
                </span>
                <span className="mt-1 text-[10px] font-bold tracking-[0.22em] uppercase">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[10px] font-bold tracking-[0.32em] text-[#1a1a2e]/55 uppercase">
            ↑ Tap a flavor to taste it
          </p>
        </div>
      </div>
    </div>
  );
}
