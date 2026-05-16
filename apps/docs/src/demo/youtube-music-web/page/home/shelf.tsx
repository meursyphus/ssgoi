"use client";

import { ChevronRight, Play } from "lucide-react";
import { useSong } from "@/demo/youtube-music-web/state/song";
import type { HomeShelf, SongCard } from "@/demo/youtube-music-web/api/song";

export function Shelf({ shelf }: { shelf: HomeShelf }) {
  return (
    <section>
      <header className="mb-3 flex items-end justify-between">
        <h3 className="text-[18px] font-semibold tracking-tight">
          {shelf.title}
        </h3>
        <button className="flex items-center gap-1 text-[12px] text-white/60 hover:text-white">
          모두 보기 <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </header>
      {shelf.kind === "list" ? (
        <QuickPickGrid items={shelf.items} />
      ) : (
        <CardRow items={shelf.items} />
      )}
    </section>
  );
}

function QuickPickGrid({ items }: { items: SongCard[] }) {
  const song = useSong((s) => ({ actions: s.actions }));
  return (
    <ul className="grid gap-1.5 sm:grid-cols-2">
      {items.map((s) => (
        <li key={s.id}>
          <button
            type="button"
            onClick={() => song.actions.play(s.id)}
            className="group flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-white/5"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded">
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
  );
}

function CardRow({ items }: { items: SongCard[] }) {
  const song = useSong((s) => ({ actions: s.actions }));
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 scrollbar-hide">
      {items.map((s) => (
        <button
          type="button"
          onClick={() => song.actions.play(s.id)}
          key={s.id}
          className="group w-[180px] shrink-0 text-left"
        >
          <div className="relative h-[180px] w-[180px] overflow-hidden rounded-md bg-white/[0.04]">
            <img
              src={s.thumbnail}
              alt={s.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              <Play className="h-4 w-4" fill="currentColor" />
            </span>
          </div>
          <div className="mt-2 truncate text-[13px] font-medium">{s.title}</div>
          <div className="truncate text-[11px] text-white/55">
            {s.subtitle ?? s.artist}
          </div>
        </button>
      ))}
    </div>
  );
}
