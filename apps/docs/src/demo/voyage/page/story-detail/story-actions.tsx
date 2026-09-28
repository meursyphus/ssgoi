"use client";

import { useState } from "react";
import { Bookmark, Heart } from "lucide-react";
import { useStory, type StoryDetail } from "@/demo/voyage/state/story";

export function StoryActions({ story }: { story: StoryDetail }) {
  const storyState = useStory((s) => ({
    current: s.current,
    actions: s.actions,
  }));
  const [liked, setLiked] = useState(false);
  const saved =
    storyState.current?.id === story.id
      ? storyState.current.saved
      : story.saved;

  return (
    <div className="mx-5 mt-7 flex items-center justify-between border-y border-neutral-100 py-3">
      <button
        type="button"
        onClick={() => setLiked((v) => !v)}
        aria-pressed={liked}
        className="flex items-center gap-1.5 text-[14px] font-semibold text-neutral-700 active:scale-95"
      >
        <Heart
          size={20}
          strokeWidth={2.25}
          className={`transition-transform ${liked ? "scale-110 text-[#FF5A5F]" : ""}`}
          fill={liked ? "#FF5A5F" : "none"}
        />
        {story.likes + (liked ? 1 : 0)} likes
      </button>
      <button
        type="button"
        onClick={() => storyState.actions.toggleSave(story.id)}
        aria-pressed={saved}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors active:scale-95 ${
          saved
            ? "bg-[#FFEFEF] text-[#FF5A5F]"
            : "bg-neutral-100 text-neutral-700"
        }`}
      >
        <Bookmark
          size={15}
          strokeWidth={2.5}
          fill={saved ? "currentColor" : "none"}
        />
        {saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
