"use client";

import type { StoryDetail } from "@/demo/voyage/state/story";

export function StoryBody({ story }: { story: StoryDetail }) {
  return (
    <div className="mt-5 border-t border-neutral-100 px-5 pt-5">
      <p className="text-[17px] font-medium leading-relaxed text-neutral-900">
        {story.excerpt}
      </p>
      {story.body.map((paragraph) => (
        <p
          key={paragraph}
          className="mt-4 text-[15.5px] leading-[1.75] text-neutral-700"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
