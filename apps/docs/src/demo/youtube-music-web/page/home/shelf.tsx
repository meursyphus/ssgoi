"use client";

import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type {
  Shelf as ShelfData,
  ShelfCard,
} from "@/demo/youtube-music-web/api/song";

export function Shelf({ shelf }: { shelf: ShelfData }) {
  return (
    <section>
      <ShelfHeader shelf={shelf} />
      {shelf.kind === "quick-picks" ? (
        <QuickPickGrid items={shelf.items} />
      ) : (
        <VideoCardRow items={shelf.items} />
      )}
    </section>
  );
}

function ShelfHeader({ shelf }: { shelf: ShelfData }) {
  return (
    <header className="mb-4 flex items-end justify-between gap-4">
      <div>
        {shelf.attribution && (
          <div className="mb-1 flex items-center gap-2 text-[12px] text-white/65">
            <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-white/10">
              <img
                src={shelf.attribution.avatar}
                alt={shelf.attribution.name}
                className="h-full w-full object-cover"
              />
            </span>
            <span>{shelf.attribution.name}</span>
          </div>
        )}
        <h2 className="text-[26px] font-bold tracking-tight leading-tight">
          {shelf.title}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        {shelf.kind === "quick-picks" && (
          <button
            type="button"
            className="hidden h-9 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 text-[13px] font-medium text-white hover:bg-white/[0.08] md:inline-flex"
          >
            Play all
          </button>
        )}
        <CarouselNav />
      </div>
    </header>
  );
}

function CarouselNav() {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="previous"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="next"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function QuickPickGrid({ items }: { items: ShelfCard[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
      {items.map((it) => (
        <li key={it.id}>
          <button
            type="button"
            className="group flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-white/[0.05]"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded">
              <img
                src={it.thumbnail}
                alt={it.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-4 w-4 text-white" fill="currentColor" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-medium leading-tight">
                {it.title}
              </div>
              <div className="truncate text-[12px] text-white/55">
                {it.subtitle}
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

function VideoCardRow({ items }: { items: ShelfCard[] }) {
  return (
    <div className="-mx-2 flex gap-4 overflow-x-auto px-2 pb-2 scrollbar-hide">
      {items.map((it) => (
        <button
          type="button"
          key={it.id}
          className="group w-[280px] shrink-0 text-left"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-white/[0.06]">
            <img
              src={it.thumbnail}
              alt={it.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-black shadow-lg">
                <Play className="h-5 w-5" fill="currentColor" />
              </span>
            </div>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-black opacity-80 transition-opacity group-hover:opacity-0">
                <Play className="h-4 w-4" fill="currentColor" />
              </span>
            </span>
          </div>
          <div className="mt-2 truncate text-[14px] font-medium">
            {it.title}
          </div>
          <div className="truncate text-[12px] text-white/55">
            {it.subtitle}
          </div>
        </button>
      ))}
    </div>
  );
}
