"use client";

import { X } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import type { StoryDetail } from "@/demo/instagram/state/profile";

export function StoryHeader({
  story,
  closeHref,
}: {
  story: StoryDetail;
  closeHref: string;
}) {
  return (
    <div className="mt-2.5 flex items-center gap-2 pl-1.5">
      <img
        src={story.avatar}
        alt=""
        className="h-8 w-8 rounded-full object-cover"
      />
      <span className="max-w-[55%] truncate text-[13px] font-semibold drop-shadow">
        {story.label}
      </span>
      <span className="text-[13px] text-white/70 drop-shadow">
        {story.timeLabel}
      </span>
      <DemoBackLink
        fallback={closeHref}
        aria-label="닫기"
        className="relative z-10 ml-auto grid h-10 w-10 place-items-center"
      >
        <X className="h-7 w-7 drop-shadow" strokeWidth={1.8} />
      </DemoBackLink>
    </div>
  );
}
