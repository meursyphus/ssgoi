"use client";

import { Bookmark } from "lucide-react";
import { Link } from "@/lib/link";
import { useStory } from "@/demo/voyage/state/story";
import { StoryCard } from "../shared/story-card";
import { BASE } from "../shared/routes";

export function SavedList() {
  const story = useStory((s) => ({ savedStories: s.savedStories }));

  if (story.savedStories.isLoading) {
    return (
      <div className="px-5 pt-3" aria-hidden>
        <div className="aspect-[4/5] w-full animate-pulse rounded-3xl bg-neutral-100" />
      </div>
    );
  }

  if (story.savedStories.data.length === 0) {
    return (
      <div className="flex flex-col items-center px-10 pt-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFEFEF] text-[#FF5A5F]">
          <Bookmark size={24} strokeWidth={2.25} />
        </span>
        <h2 className="mt-4 text-[17px] font-bold tracking-tight text-neutral-900">
          Nothing saved yet
        </h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-500">
          Tap the bookmark on any story to keep it here for your next trip.
        </p>
        <Link
          href={BASE}
          scroll={false}
          className="mt-5 rounded-full bg-neutral-900 px-5 py-2.5 text-[14px] font-semibold text-white active:bg-neutral-700"
        >
          Explore stories
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7 px-5 pt-3">
      {story.savedStories.data.map((s) => (
        <StoryCard key={s.id} story={s} />
      ))}
    </div>
  );
}
