"use client";

import { Link } from "@/lib/link";
import { DragScroller } from "@/lib/components/drag-scroller";
import type { StoryTrayItem } from "@/demo/instagram/state/profile";

export function StoryTray({ items }: { items: StoryTrayItem[] }) {
  return (
    <DragScroller className="pb-3 pt-1" trackClassName="gap-3.5 px-3">
      {items.length === 0
        ? Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex w-[70px] shrink-0 flex-col items-center gap-1.5"
            >
              <div className="h-[66px] w-[66px] animate-pulse rounded-full bg-neutral-100" />
              <div className="h-2.5 w-12 animate-pulse rounded bg-neutral-100" />
            </div>
          ))
        : items.map((item) => <TrayItem key={item.id} item={item} />)}
    </DragScroller>
  );
}

function TrayItem({ item }: { item: StoryTrayItem }) {
  return (
    <Link
      href={`/demo/instagram/stories/${item.id}`}
      scroll={false}
      className="flex w-[70px] shrink-0 flex-col items-center gap-1.5 active:opacity-70"
    >
      <div
        className={`rounded-full p-[2px] ${
          item.seen
            ? "bg-neutral-300"
            : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
        }`}
      >
        <div className="rounded-full bg-white p-[2px]">
          {/* 픽셀 radius — zoom이 원을 원으로 접을 수 있게 */}
          <img
            src={item.avatar}
            alt={item.label}
            width={58}
            height={58}
            className="h-[58px] w-[58px] rounded-[29px] object-cover"
            data-zoom-exit-key={item.id}
          />
        </div>
      </div>
      <span
        className={`max-w-full truncate text-[11px] ${
          item.isMine ? "text-neutral-500" : "text-neutral-800"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}
