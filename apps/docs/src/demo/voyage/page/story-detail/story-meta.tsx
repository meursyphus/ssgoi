"use client";

import { useState } from "react";
import type { StoryDetail } from "@/demo/voyage/state/story";

export function StoryMeta({ story }: { story: StoryDetail }) {
  const [following, setFollowing] = useState(false);

  return (
    <div className="px-5 pt-5">
      <h1 className="text-[26px] font-extrabold leading-[1.15] tracking-tight text-neutral-900">
        {story.title}
      </h1>
      <div className="mt-4 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white ${story.authorColor}`}
        >
          {story.authorInitial}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold text-neutral-900">
            {story.author}
          </div>
          <div className="text-[12.5px] text-neutral-500">
            {story.timeLabel} ago
            <span className="px-1 text-neutral-300">·</span>
            {story.readMinutes} min read
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFollowing((v) => !v)}
          aria-pressed={following}
          className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors active:scale-95 ${
            following
              ? "bg-neutral-100 text-neutral-700"
              : "bg-neutral-900 text-white"
          }`}
        >
          {following ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
}
