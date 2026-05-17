"use client";

import Link from "next/link";
import type { PostSimple } from "@/demo/instagram/state/post";

export function GridItem({ post }: { post: PostSimple }) {
  return (
    <Link
      href={`/demo/instagram/feed/${post.id}`}
      scroll={false}
      className="relative block aspect-square overflow-hidden"
    >
      <img
        src={post.image}
        alt=""
        className="h-full w-full object-cover"
        data-zoom-exit-key={post.id}
      />
      {post.kind === "video" && (
        <span className="absolute right-1.5 top-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7-11-7z" />
          </svg>
        </span>
      )}
      {post.kind === "carousel" && (
        <span className="absolute right-1.5 top-1.5 text-white">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="7" y="7" width="13" height="13" rx="2" />
            <path d="M4 16V5a1 1 0 0 1 1-1h11" />
          </svg>
        </span>
      )}
    </Link>
  );
}
