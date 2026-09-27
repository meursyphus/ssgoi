"use client";

import { useState } from "react";
import type { PostComment } from "@/demo/instagram/state/post";
import { Pop } from "../shared/pop";

export function CommentList({
  comments,
  onReply,
}: {
  comments: PostComment[];
  onReply: (user: string) => void;
}) {
  if (comments.length === 0) return null;
  return (
    <div className="mt-2 space-y-3 px-3 pt-1">
      {comments.map((c) => (
        <CommentRow key={c.id} comment={c} onReply={onReply} />
      ))}
    </div>
  );
}

function CommentRow({
  comment,
  onReply,
}: {
  comment: PostComment;
  onReply: (user: string) => void;
}) {
  const [liked, setLiked] = useState(false);
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
          <button
            type="button"
            onClick={() => onReply(comment.user)}
            className="font-semibold active:text-neutral-300"
          >
            답글 달기
          </button>
        </div>
      </div>
      <button
        type="button"
        aria-label={liked ? "댓글 좋아요 취소" : "댓글 좋아요"}
        aria-pressed={liked}
        onClick={() => setLiked((v) => !v)}
        className={`-mx-1.5 -mb-1.5 -mt-0.5 p-1.5 ${liked ? "text-red-500" : "text-neutral-400"}`}
      >
        <Pop on={liked}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </Pop>
      </button>
    </div>
  );
}
