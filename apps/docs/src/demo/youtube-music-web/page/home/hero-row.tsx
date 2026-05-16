"use client";

import { MoreHorizontal, Play } from "lucide-react";
import { useSong } from "@/demo/youtube-music-web/state/song";
import type { HeroFeature } from "@/demo/youtube-music-web/api/song";

export function HeroRow({ hero }: { hero: HeroFeature }) {
  const song = useSong((s) => ({ actions: s.actions }));
  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <button
        type="button"
        onClick={() => song.actions.play(hero.id)}
        className="group relative h-72 overflow-hidden rounded-xl bg-neutral-900 text-left"
      >
        <img
          src={hero.thumbnail}
          alt={hero.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/30 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-7">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            {hero.eyebrow}
          </span>
          <h2 className="mt-2 max-w-md text-[34px] font-bold leading-[1.05] tracking-tight">
            {hero.title}
          </h2>
          <p className="mt-2 text-sm text-white/75">{hero.subtitle}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black">
              <Play className="h-4 w-4" fill="currentColor" />
              재생
            </span>
            <span className="inline-flex h-10 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 text-sm font-medium text-white">
              <MoreHorizontal className="h-4 w-4" />내 라이브러리에 저장
            </span>
          </div>
        </div>
      </button>

      <aside className="rounded-xl bg-white/[0.04] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight">
            {hero.sideTitle}
          </h3>
          <button className="text-[12px] text-white/60 hover:text-white">
            모두 보기
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {hero.sideItems.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => song.actions.play(s.id)}
                className="group flex w-full items-center gap-3 rounded-md p-1.5 text-left transition-colors hover:bg-white/5"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded">
                  <img
                    src={s.thumbnail}
                    alt={s.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="h-4 w-4 text-white" fill="currentColor" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium leading-tight">
                    {s.title}
                  </div>
                  <div className="truncate text-[11px] text-white/55">
                    {s.artist}
                  </div>
                </div>
                <span className="text-[11px] tabular-nums text-white/45">
                  {s.duration}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
