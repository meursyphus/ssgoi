"use client";

import type { PostDetail } from "@/demo/instagram/state/post";
import type { ProfileMe } from "@/demo/instagram/state/profile";

export function FeedDetailMeta({
  post,
  author,
}: {
  post: PostDetail;
  author: ProfileMe | null;
}) {
  return (
    <div className="px-3 pt-2 text-[13px] text-neutral-900">
      <p className="font-semibold">{post.likesLabel}</p>
      <p className="mt-1 leading-snug">
        <span className="font-semibold">
          {author?.username ?? "deaseungseung94"}
        </span>{" "}
        <span className="text-neutral-800">{post.caption}</span>
      </p>
      <p className="mt-1 text-neutral-500">{post.commentsLabel}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-neutral-400">
        {post.publishedAtLabel}
      </p>
    </div>
  );
}
