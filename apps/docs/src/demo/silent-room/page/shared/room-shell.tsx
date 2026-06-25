"use client";

import type { RoomData } from "./types";
export function RoomShell({ data }: { data: RoomData }) {
  const alignClass = data.align === "left" ? "items-start" : "items-end";
  const textAlignClass = data.align === "left" ? "text-left" : "text-right";
  return (
    <div className="relative h-full w-full">
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={data.bg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* dual gradient: top dark for chrome, bottom dark for label */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.15)_0%,_rgba(0,0,0,0.55)_70%,_rgba(0,0,0,0.85)_100%)]" />

        {/* center hairline mark */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <p className="font-serif text-[10px] tracking-[0.6em] text-[#f5f1ea]/30 uppercase">
            — {data.ordinal} —
          </p>
        </div>

        <div
          className={`relative flex h-full w-full flex-col justify-end ${alignClass} px-6 pt-32 pb-28 lg:px-10 lg:pb-32`}
        >
          <div className={`max-w-xl ${textAlignClass}`}>
            <p className="font-serif text-[10px] tracking-[0.46em] text-[#c9a96b] uppercase">
              Room {data.index}
            </p>
            <h1 className="mt-4 font-serif text-6xl leading-[0.95] font-normal text-[#f5f1ea] sm:text-7xl lg:text-[5.5rem]">
              {data.title}
            </h1>
            <p
              className={`mt-6 max-w-md text-sm leading-relaxed text-[#f5f1ea]/70 ${data.align === "right" ? "ml-auto" : ""}`}
            >
              {data.caption}
            </p>
            <dl
              className={`mt-8 grid grid-cols-3 gap-x-6 text-[10px] tracking-[0.28em] uppercase ${textAlignClass}`}
            >
              <div>
                <dt className="text-[#c9a96b]/80">Artist</dt>
                <dd className="mt-1 text-[#f5f1ea]/85">{data.artist}</dd>
              </div>
              <div>
                <dt className="text-[#c9a96b]/80">Medium</dt>
                <dd className="mt-1 text-[#f5f1ea]/85">{data.medium}</dd>
              </div>
              <div>
                <dt className="text-[#c9a96b]/80">Year</dt>
                <dd className="mt-1 text-[#f5f1ea]/85">{data.year}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
