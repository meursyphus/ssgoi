"use client";

import { MoreVertical, Play } from "lucide-react";
import type { SongDetail } from "@/demo/youtube-music-web/api/song";

export function UpNext({ detail }: { detail: SongDetail }) {
  return (
    <section>
      <header className="mb-2 flex items-end justify-between">
        <div>
          <h2 className="text-[16px] font-semibold tracking-tight">Up next</h2>
          <p className="mt-1 text-[12px] text-white/55">
            {detail.artist} radio • Endless mix
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/70 hover:bg-white/5"
        >
          Save
        </button>
      </header>

      <ul className="overflow-hidden rounded-lg border border-white/5">
        <li className="flex items-center gap-3 bg-white/5 px-3 py-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[12px] text-white/55">
            <span className="flex h-4 w-4 items-end justify-between">
              <span className="h-4 w-0.5 animate-pulse bg-red-500" />
              <span className="h-2.5 w-0.5 animate-pulse bg-red-500 [animation-delay:120ms]" />
              <span className="h-3 w-0.5 animate-pulse bg-red-500 [animation-delay:240ms]" />
            </span>
          </div>
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded">
            <img
              src={detail.thumbnail}
              alt={detail.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium">
              {detail.title}
            </div>
            <div className="truncate text-[11px] text-red-400">
              Now playing • {detail.artist}
            </div>
          </div>
          <span className="text-[11px] tabular-nums text-white/55">
            {detail.duration}
          </span>
        </li>

        {detail.upNext.map((s, idx) => (
          <li
            key={s.id}
            className="group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white/5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[12px] text-white/55">
              <span className="group-hover:hidden">{idx + 1}</span>
              <Play
                className="hidden h-4 w-4 group-hover:block"
                fill="currentColor"
              />
            </div>
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded">
              <img
                src={s.thumbnail}
                alt={s.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium">{s.title}</div>
              <div className="truncate text-[11px] text-white/55">
                {s.subtitle}
              </div>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/55 opacity-0 hover:bg-white/10 group-hover:opacity-100"
              aria-label="menu"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
