"use client";

import { Link } from "@/lib/link";
import type { TaggedPost } from "@/demo/instagram/state/post";

export function TaggedItem({ item }: { item: TaggedPost }) {
  return (
    <Link
      href={`/demo/instagram/feed/${item.id}`}
      scroll={false}
      className="relative block aspect-square overflow-hidden"
    >
      <img
        src={item.image}
        alt={item.userLabel}
        width={600}
        height={600}
        className="h-full w-full object-cover"
        data-zoom-exit-key={item.id}
      />
      <div className="absolute left-1.5 top-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white">
        {item.userLabel}
      </div>
    </Link>
  );
}
