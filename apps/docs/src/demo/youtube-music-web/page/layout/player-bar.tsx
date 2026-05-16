"use client";

import {
  ChevronUp,
  Heart,
  ListMusic,
  Maximize2,
  MoreHorizontal,
  Pause,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useSong } from "@/demo/youtube-music-web/state/song";

const FALLBACK = {
  thumbnail:
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&q=70",
  title: "Cruel Summer",
  artist: "Taylor Swift",
};

export function PlayerBar() {
  const songState = useSong((s) => ({ current: s.current }));
  const playing = songState.current ?? FALLBACK;

  return (
    <footer className="grid h-[72px] shrink-0 grid-cols-[1fr_1.4fr_1fr] items-center border-t border-white/5 bg-[#030303] px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="expand"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white/5">
          <img
            src={playing.thumbnail}
            alt={playing.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[13px] font-medium">
            {playing.title}
          </div>
          <div className="truncate text-[11px] text-white/55">
            {playing.artist}
          </div>
        </div>
        <button
          type="button"
          aria-label="like"
          className="ml-2 flex h-9 w-9 items-center justify-center rounded-full text-white/65 hover:bg-white/10"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-2">
          <button
            aria-label="shuffle"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10"
          >
            <Shuffle className="h-4 w-4" />
          </button>
          <button
            aria-label="prev"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
          >
            <SkipBack className="h-5 w-5" fill="currentColor" />
          </button>
          <button
            aria-label="play"
            className="mx-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-white/90"
          >
            <Pause className="h-5 w-5" fill="currentColor" />
          </button>
          <button
            aria-label="next"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
          >
            <SkipForward className="h-5 w-5" fill="currentColor" />
          </button>
          <button
            aria-label="repeat"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10"
          >
            <Repeat className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1 flex w-full max-w-2xl items-center gap-3 text-[10px] text-white/55">
          <span className="tabular-nums">1:24</span>
          <div className="group relative flex h-1 flex-1 items-center">
            <div className="h-1 w-full rounded-full bg-white/15" />
            <div className="absolute left-0 h-1 w-1/3 rounded-full bg-white" />
            <div className="absolute left-1/3 -ml-1.5 h-3 w-3 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <span className="tabular-nums">3:31</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1">
        <button
          aria-label="lyrics"
          className="hidden h-9 items-center gap-2 rounded-full px-3 text-[12px] text-white/70 hover:bg-white/10 md:flex"
        >
          가사
        </button>
        <button
          aria-label="related"
          className="hidden h-9 items-center gap-2 rounded-full px-3 text-[12px] text-white/70 hover:bg-white/10 md:flex"
        >
          관련 항목
        </button>
        <button
          aria-label="queue"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
        >
          <ListMusic className="h-5 w-5" />
        </button>
        <div className="ml-1 flex items-center gap-1">
          <Volume2 className="h-4 w-4 text-white/70" />
          <div className="hidden h-1 w-24 overflow-hidden rounded-full bg-white/15 md:block">
            <div className="h-full w-2/3 rounded-full bg-white" />
          </div>
        </div>
        <button
          aria-label="more"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/65 hover:bg-white/10"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
        <button
          aria-label="fullscreen"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/65 hover:bg-white/10"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </footer>
  );
}
