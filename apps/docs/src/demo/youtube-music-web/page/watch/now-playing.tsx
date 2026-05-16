"use client";

import { Heart, MoreHorizontal, Play, Share2 } from "lucide-react";
import type { SongDetail } from "@/demo/youtube-music-web/api/song";

export function NowPlaying({ detail }: { detail: SongDetail }) {
  return (
    <div className="flex flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-900 shadow-2xl shadow-black/60">
        <img
          src={detail.thumbnail}
          alt={detail.title}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <h1 className="mt-5 text-[26px] font-bold leading-tight tracking-tight">
        {detail.title}
      </h1>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/65">
        <span className="font-medium text-white/85">{detail.artist}</span>
        <span>•</span>
        <span>{detail.album}</span>
        <span>•</span>
        <span>{detail.releaseYear}</span>
      </div>
      <p className="mt-3 text-[12px] text-white/55">{detail.plays}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-[13px] font-semibold text-black hover:bg-white/90"
        >
          <Play className="h-4 w-4" fill="currentColor" />
          Play
        </button>
        <button
          type="button"
          aria-label="like"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10"
        >
          <Heart className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="share"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10"
        >
          <Share2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="more"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-white/70">
        {detail.description}
      </p>
    </div>
  );
}
