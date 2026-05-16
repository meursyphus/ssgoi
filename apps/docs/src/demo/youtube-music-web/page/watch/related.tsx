"use client";

import { Play } from "lucide-react";
import { useSong } from "@/demo/youtube-music-web/state/song";
import type { SongDetail } from "@/demo/youtube-music-web/api/song";

export function Related({ detail }: { detail: SongDetail }) {
  const song = useSong((s) => ({ actions: s.actions }));
  return (
    <section>
      <header className="mb-3">
        <h2 className="text-[16px] font-semibold tracking-tight">관련 항목</h2>
        <p className="mt-1 text-[12px] text-white/55">
          {detail.artist} 와 비슷한 트랙
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {detail.upNext.map((s) => (
          <button
            type="button"
            key={s.id}
            onClick={() => song.actions.play(s.id)}
            className="group flex items-center gap-3 rounded-lg p-2 text-left hover:bg-white/5"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
              <img
                src={s.thumbnail}
                alt={s.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-5 w-5 text-white" fill="currentColor" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-medium">{s.title}</div>
              <div className="truncate text-[12px] text-white/55">
                {s.artist}
              </div>
              <div className="text-[11px] text-white/40">{s.duration}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
