"use client";

import type { PostDetail } from "@/demo/instagram/state/post";
import type { ProfileMe } from "@/demo/instagram/state/profile";

/** 댓글 시트 맨 위의 원문 캡션 */
export function CaptionRow({
  post,
  me,
}: {
  post: PostDetail;
  me: ProfileMe | null;
}) {
  const username = post.author?.username ?? me?.username ?? "deaseungseung94";
  const avatar = post.author?.avatar ?? me?.avatar;
  return (
    <div className="flex items-start gap-2.5 border-b border-neutral-100 px-3 pb-3 pt-3">
      {avatar ? (
        <img
          src={avatar}
          alt={username}
          className="h-7 w-7 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-neutral-200" />
      )}
      <div className="min-w-0 flex-1">
        <p className="leading-snug">
          <span className="font-semibold">{username}</span>{" "}
          <span className="text-neutral-800">{post.caption}</span>
        </p>
        <p className="mt-0.5 text-[11px] text-neutral-500">
          {post.publishedAtLabel}
        </p>
      </div>
    </div>
  );
}
