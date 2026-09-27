"use client";

import type { RefObject } from "react";
import { MapPin } from "lucide-react";
import type { StoryDetail } from "@/demo/voyage/state/story";

export function StoryHero({
  story,
  heroRef,
}: {
  story: StoryDetail;
  /** Watched by the header, which docks once the cover scrolls away. */
  heroRef: RefObject<HTMLDivElement | null>;
}) {
  // Same 4:5 frame as the feed card, so the zoom has no crop jump.
  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden bg-neutral-100"
    >
      <img
        src={story.cover}
        alt={story.location}
        width={880}
        height={1100}
        data-zoom-enter-key={story.id}
        className="aspect-[4/5] w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
      <span className="absolute bottom-4 left-5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-semibold text-neutral-900 shadow-sm backdrop-blur">
        <MapPin size={13} strokeWidth={2.5} className="text-[#FF5A5F]" />
        {story.location}
      </span>
    </div>
  );
}
