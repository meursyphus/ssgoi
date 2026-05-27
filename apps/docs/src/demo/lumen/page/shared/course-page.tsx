"use client";

import { Play } from "lucide-react";
import { SiteMenu } from "./site-menu";
type Meta = {
  label: string;
  value: string;
};
export type CoursePageData = {
  routeId: string;
  eyebrow: string;
  title: string;
  overview: string;
  format: Meta[];
  contains: string[];
  videoUrl: string;
  posterUrl: string;
};
export function CoursePage({ data }: { data: CoursePageData }) {
  return (
    <div
      data-ssgoi-transition={data.routeId}
      className="relative h-full w-full overflow-hidden"
    >
      {/* fullscreen cinematic background — absolute so it animates with the page */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <video
          key={data.videoUrl}
          className="h-full w-full object-cover"
          src={data.videoUrl}
          poster={data.posterUrl}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
      </div>

      {/* menu + drawer — per page, inside the transition */}
      <SiteMenu />

      <div className="relative h-full w-full overflow-y-auto">
        {/* hero copy */}
        <section className="relative flex min-h-full flex-col px-6 pt-32 pb-6 lg:px-10 lg:pt-40 lg:pb-10">
          <div className="flex-1">
            <p className="text-[11px] tracking-[0.4em] text-white/70 uppercase">
              {data.eyebrow}
            </p>
            <h1 className="mt-3 max-w-[14ch] font-serif text-5xl leading-[0.95] font-bold tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              {data.title}
              <sup className="ml-1 text-base align-super">™</sup>
            </h1>
          </div>

          <div className="mt-12 border-t border-white/15 pt-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_1fr]">
              {/* overview + CTAs */}
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-[10px] tracking-[0.32em] text-white/60 uppercase">
                    Overview
                  </p>
                  <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-white/80">
                    {data.overview}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled
                    aria-disabled
                    className="cursor-not-allowed rounded-full border border-white/15 px-6 py-2.5 text-[11px] font-semibold tracking-[0.22em] text-white/30 uppercase"
                  >
                    Join Now →
                  </button>
                  <button
                    type="button"
                    disabled
                    aria-disabled
                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-[11px] font-medium tracking-[0.22em] text-white/30 uppercase"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Watch Video
                  </button>
                </div>
              </div>

              {/* format meta */}
              <div className="grid grid-cols-2 gap-x-10 gap-y-6 text-[11px] tracking-[0.18em] uppercase lg:grid-cols-1">
                {data.format.map((m) => (
                  <div key={m.label}>
                    <p className="text-amber-400/90">{m.label}</p>
                    <p className="mt-1 text-white/85">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* contains */}
              <div className="text-[11px] tracking-[0.18em] uppercase">
                <p className="text-amber-400/90">Contains</p>
                <ul className="mt-2 space-y-1 text-white/85">
                  {data.contains.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-10 text-[10px] tracking-[0.32em] text-white/50 uppercase">
              Scroll to explore
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
