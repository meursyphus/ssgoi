"use client";

import type { TaggedPost } from "@/demo/instagram/state/post";

export function TaggedItem({ item }: { item: TaggedPost }) {
  return (
    <div className="relative aspect-square overflow-hidden">
      <img
        src={item.image}
        alt={item.userLabel}
        className="h-full w-full object-cover"
      />
      <div className="absolute left-1.5 top-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white">
        {item.userLabel}
      </div>
    </div>
  );
}
