"use client";

import { useStory } from "@/demo/voyage/state/story";
import { StoryCard } from "./story-card";

export function StoryList() {
  const story = useStory((s) => ({ stories: s.stories }));

  if (story.stories.isLoading) {
    return (
      <div className="flex flex-col gap-7 px-5 pt-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3" aria-hidden>
            <div className="aspect-[4/5] w-full animate-pulse rounded-3xl bg-neutral-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7 px-5 pt-3">
      {story.stories.data.map((s) => (
        <StoryCard key={s.id} story={s} />
      ))}
    </div>
  );
}
