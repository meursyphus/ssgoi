"use client";

import { useState } from "react";
import { Bookmark, Heart, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { StorySimple } from "@/demo/voyage/state/story";

export function StoryCard({ story }: { story: StorySimple }) {
  const [saved, setSaved] = useState(story.saved);
  const [liked, setLiked] = useState(false);

  return (
    <article className="relative flex flex-col">
      {/* The cover is the only <button> over the image. The save control is a
          sibling overlay (not nested) — nesting <button> in <button> is invalid
          HTML and trips a hydration error. */}
      <button
        type="button"
        onClick={() => toast("Story detail is mocked in this demo")}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-3xl bg-neutral-100 text-left"
      >
        <img
          src={story.cover}
          alt={story.location}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-semibold text-neutral-900 shadow-sm backdrop-blur">
          <MapPin size={13} strokeWidth={2.5} className="text-[#FF5A5F]" />
          {story.location}
        </span>
      </button>
      <button
        type="button"
        onClick={() => setSaved((v) => !v)}
        aria-label={saved ? "Remove from saved" : "Save story"}
        className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-neutral-900 shadow-sm backdrop-blur active:scale-95"
      >
        <Bookmark
          size={17}
          strokeWidth={2.25}
          fill={saved ? "currentColor" : "none"}
        />
      </button>

      <div className="px-0.5 pt-3">
        <h3 className="text-[17px] font-bold leading-snug tracking-tight text-neutral-900">
          {story.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-neutral-600">
          {story.excerpt}
        </p>

        <div className="mt-3 flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white ${story.authorColor}`}
          >
            {story.authorInitial}
          </span>
          <div className="min-w-0 flex-1 text-[12.5px] text-neutral-500">
            <span className="font-semibold text-neutral-800">
              {story.author}
            </span>
            <span className="px-1 text-neutral-300">·</span>
            {story.timeLabel}
            <span className="px-1 text-neutral-300">·</span>
            {story.readMinutes} min read
          </div>
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            aria-label={liked ? "Unlike" : "Like"}
            className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-neutral-500 active:scale-95"
          >
            <Heart
              size={17}
              strokeWidth={2.25}
              className={liked ? "text-[#FF5A5F]" : ""}
              fill={liked ? "#FF5A5F" : "none"}
            />
            {story.likes + (liked ? 1 : 0)}
          </button>
        </div>
      </div>
    </article>
  );
}
