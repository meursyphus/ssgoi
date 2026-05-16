"use client";

import { SsgoiTransition } from "@ssgoi/react";

const PROJECTS = [
  { year: "2026", title: "Helios — Editorial Identity" },
  { year: "2025", title: "Forma — Custom Type" },
  { year: "2025", title: "Pulp & Press — Print Series" },
  { year: "2024", title: "Tide House — Brand System" },
  { year: "2024", title: "Salt River Music — Album Art" },
];

export default function WorkArchivePage() {
  return (
    <SsgoiTransition id="/demo/nora-hale" className="relative h-full w-full">
      <div className="relative flex h-full w-full flex-col overflow-y-auto px-6 lg:px-10">
        <section className="flex flex-col items-center pt-36 lg:pt-44">
          <p className="text-[11px] tracking-[0.32em] text-[#1a1a1a]/55 uppercase">
            Selected 2024 — 2026
          </p>
          <h1 className="mt-4 text-center font-serif text-7xl leading-[0.9] font-black tracking-tight text-[#6b5cff] sm:text-8xl lg:text-[9rem]">
            WORK
            <br />
            ARCHIVE
          </h1>
        </section>

        <section className="mx-auto mt-20 w-full max-w-3xl flex-1">
          <ul className="divide-y divide-[#1a1a1a]/15">
            {PROJECTS.map((p) => (
              <li
                key={p.title}
                className="flex items-baseline justify-between gap-6 py-4"
              >
                <span className="text-xs tracking-[0.22em] text-[#1a1a1a]/55 uppercase">
                  {p.year}
                </span>
                <span className="flex-1 px-4 text-base text-[#1a1a1a]/85">
                  {p.title}
                </span>
                <span className="text-xs tracking-[0.22em] text-[#6b5cff] uppercase">
                  Case →
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 flex flex-col items-center pb-10">
          <p className="text-xs tracking-[0.32em] text-[#1a1a1a]/55 uppercase">
            2026
          </p>
          <p className="text-center font-serif text-6xl leading-[0.9] font-black tracking-tight text-[#1a1a1a]/25 sm:text-7xl lg:text-[8rem]">
            NORA
            <br />
            HALE
          </p>
        </section>
      </div>
    </SsgoiTransition>
  );
}
