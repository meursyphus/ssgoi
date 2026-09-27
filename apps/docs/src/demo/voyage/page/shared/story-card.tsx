"use client";

import { useState } from "react";
import { Bookmark, Heart, MapPin } from "lucide-react";
import { Link } from "@/lib/link";
import { useStory, type StorySimple } from "@/demo/voyage/state/story";
import { BASE } from "./routes";

/**
 * Feed/Saved card. The title link is stretched over the whole card (its
 * ::after covers the article), so the cover, excerpt and author row all open
 * the story while the Save and Like buttons stay separate controls above it —
 * a <button> nested inside an <a> would be invalid HTML.
 */
export function StoryCard({ story }: { story: StorySimple }) {
  const storyState = useStory((s) => ({ actions: s.actions }));
  const [liked, setLiked] = useState(false);

  return (
    <article className="relative flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-neutral-100">
        <img
          src={story.cover}
          alt={story.location}
          width={880}
          height={1100}
          loading="lazy"
          data-zoom-exit-key={story.id}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-semibold text-neutral-900 shadow-sm backdrop-blur">
          <MapPin size={13} strokeWidth={2.5} className="text-[#FF5A5F]" />
          {story.location}
        </span>
      </div>
      <button
        type="button"
        onClick={() => storyState.actions.toggleSave(story.id)}
        aria-label={story.saved ? "Remove from saved" : "Save story"}
        aria-pressed={story.saved}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-neutral-900 shadow-sm backdrop-blur transition-transform active:scale-90"
      >
        <Bookmark
          size={17}
          strokeWidth={2.25}
          fill={story.saved ? "currentColor" : "none"}
        />
      </button>

      <div className="px-0.5 pt-3">
        <h3 className="text-[17px] font-bold leading-snug tracking-tight text-neutral-900">
          <Link
            href={`${BASE}/story/${story.id}`}
            scroll={false}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {story.title}
          </Link>
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
            aria-pressed={liked}
            className="relative z-10 flex shrink-0 items-center gap-1 text-[13px] font-semibold text-neutral-500 active:scale-95"
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
