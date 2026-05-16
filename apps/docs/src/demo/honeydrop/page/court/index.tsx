"use client";

import { SsgoiTransition } from "@ssgoi/react";

const BG =
  "https://images.unsplash.com/photo-1518407613690-d9fc990e795f?auto=format&fit=crop&w=2400&q=80";

export default function CourtPage() {
  return (
    <SsgoiTransition id="/demo/honeydrop" className="relative h-full w-full">
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={BG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85" />

        <div className="relative flex h-full w-full flex-col items-center justify-end px-6 pb-24 lg:px-10 lg:pb-28">
          <p className="font-serif text-xs tracking-[0.42em] text-[#f0b500]/85 uppercase">
            Chapter 01 · The Court
          </p>
          <h1 className="mt-4 text-center font-serif text-6xl leading-[0.9] font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
            UNRIVALED.
          </h1>
          <p className="mt-5 max-w-md text-center text-sm leading-relaxed text-white/70">
            Open the hive to step onto the court. The lights are low, the
            hardwood is hot, the bee is watching.
          </p>
          <p className="mt-10 text-[10px] tracking-[0.4em] text-white/40 uppercase">
            ↑ Tap the hive to navigate
          </p>
        </div>
      </div>
    </SsgoiTransition>
  );
}
