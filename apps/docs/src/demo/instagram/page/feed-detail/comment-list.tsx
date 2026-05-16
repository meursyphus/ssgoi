"use client";

import type { PostComment } from "@/demo/instagram/state/post";

export function CommentList({ comments }: { comments: PostComment[] }) {
  if (comments.length === 0) return null;
  return (
    <div className="mt-2 space-y-3 px-3 pt-1">
      {comments.map((c) => (
        <CommentRow key={c.id} comment={c} />
      ))}
    </div>
  );
}

function CommentRow({ comment }: { comment: PostComment }) {
  return (
    <div className="flex items-start gap-2.5">
      <img
        src={comment.avatar}
        alt={comment.user}
        className="h-7 w-7 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="leading-snug">
          <span className="font-semibold">{comment.user}</span>{" "}
          <span className="text-neutral-800">{comment.text}</span>
        </p>
        <div className="mt-0.5 flex items-center gap-3 text-[11px] text-neutral-500">
          <span>{comment.whenLabel}</span>
          <span>{comment.likesLabel}</span>
          <button className="font-semibold">답글 달기</button>
        </div>
      </div>
      <button className="mt-1 text-neutral-400">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
  );
}
