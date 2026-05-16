"use client";

import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Pause,
  SkipBack,
  SkipForward,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useSong } from "@/demo/youtube-music-web/state/song";

const HOME_PATH = "/demo/youtube-music-web";
const WATCH_PATH = "/demo/youtube-music-web/watch";

const DEFAULT_TRACK = {
  id: "wggigwtz4dQ",
  title: "IRIS OUT",
  artist: "Kenshi Yonezu",
  album: "IRIS OUT",
  year: "2025",
  duration: "2:32",
  thumbnail:
    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80",
};

export function PlayerBar() {
  const song = useSong((s) => ({ current: s.current }));
  const pathname = usePathname();
  const router = useRouter();
  const onWatch = pathname === WATCH_PATH;

  const playing = song.current
    ? {
        id: song.current.id,
        title: song.current.title,
        artist: song.current.artist,
        album: song.current.album,
        year: String(song.current.releaseYear),
        duration: song.current.duration,
        thumbnail: song.current.thumbnail,
      }
    : DEFAULT_TRACK;

  const toggleWatch = () => {
    if (onWatch) router.push(HOME_PATH);
    else router.push(`${WATCH_PATH}?v=${playing.id}`);
  };

  return (
    <footer className="grid h-[72px] shrink-0 grid-cols-[1fr_minmax(0,2.2fr)_1fr] items-center border-t border-white/[0.06] bg-[#030303] px-4">
      <div className="flex items-center gap-3">
        <PlayerIconButton aria-label="previous">
          <SkipBack className="h-5 w-5 text-white/90" fill="currentColor" />
        </PlayerIconButton>
        <button
          type="button"
          aria-label="play"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-white/90"
        >
          <Pause className="h-5 w-5" fill="currentColor" />
        </button>
        <PlayerIconButton aria-label="next">
          <SkipForward className="h-5 w-5 text-white/90" fill="currentColor" />
        </PlayerIconButton>
        <span className="ml-2 text-[12px] tabular-nums text-white/65">
          0:00 / {playing.duration}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white/[0.06]">
          <img
            src={playing.thumbnail}
            alt={playing.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[14px] font-semibold">
            {playing.title}
          </div>
          <div className="truncate text-[12px] text-white/60">
            {playing.artist} • {playing.album} • {playing.year}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <PlayerIconButton aria-label="dislike">
            <ThumbsDown className="h-5 w-5 text-white/80" />
          </PlayerIconButton>
          <PlayerIconButton aria-label="like">
            <ThumbsUp className="h-5 w-5 text-white/80" />
          </PlayerIconButton>
          <PlayerIconButton aria-label="more">
            <MoreHorizontal className="h-5 w-5 text-white/80" />
          </PlayerIconButton>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1">
        <PlayerIconButton aria-label="previous-related">
          <SkipBack className="h-5 w-5 text-white/80" fill="currentColor" />
        </PlayerIconButton>
        <button
          type="button"
          aria-label={onWatch ? "close now playing" : "open now playing"}
          onClick={toggleWatch}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 hover:bg-white/[0.08]"
        >
          {onWatch ? (
            <ChevronDown className="h-6 w-6" strokeWidth={2.2} />
          ) : (
            <ChevronUp className="h-6 w-6" strokeWidth={2.2} />
          )}
        </button>
      </div>
    </footer>
  );
}

function PlayerIconButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/[0.08]"
      {...rest}
    >
      {children}
    </button>
  );
}
