"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { Comment } from "../../mock-data";

const avatarFor = (author: string) =>
  `https://picsum.photos/seed/yt-${author.replace(/[^a-z0-9]/gi, "")}/72/72`;

/** Like/Dislike under a comment: in-place toggles, no route. */
function CommentReactions() {
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);
  const toggle = (next: "like" | "dislike") =>
    setReaction(reaction === next ? null : next);

  return (
    <div className="-ml-2 mt-1 flex items-center text-neutral-700">
      <button
        type="button"
        aria-label="Like comment"
        aria-pressed={reaction === "like"}
        onClick={() => toggle("like")}
        className="flex h-8 w-8 items-center justify-center rounded-full active:bg-neutral-100"
      >
        <ThumbsUp
          className="h-4 w-4"
          fill={reaction === "like" ? "currentColor" : "none"}
        />
      </button>
      <button
        type="button"
        aria-label="Dislike comment"
        aria-pressed={reaction === "dislike"}
        onClick={() => toggle("dislike")}
        className="flex h-8 w-8 items-center justify-center rounded-full active:bg-neutral-100"
      >
        <ThumbsDown
          className="h-4 w-4"
          fill={reaction === "dislike" ? "currentColor" : "none"}
        />
      </button>
    </div>
  );
}

/** Comment thread shown inside the action sheet (watch page and Shorts). */
export function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <ul className="space-y-3 px-5 pb-2 pt-1">
      {comments.map((comment) => (
        <li key={comment.author} className="flex gap-3">
          <img
            src={avatarFor(comment.author)}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full bg-neutral-200 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-neutral-500">
              {comment.author} · {comment.ago}
            </p>
            <p className="mt-0.5 text-[14px] leading-5 text-neutral-950">
              {comment.text}
            </p>
            <CommentReactions />
          </div>
        </li>
      ))}
    </ul>
  );
}
