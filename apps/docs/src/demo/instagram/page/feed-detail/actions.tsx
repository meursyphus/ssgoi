"use client";

import { useState, type ReactNode } from "react";
import { Link } from "@/lib/link";
import { Pop } from "../shared/pop";

const HEART =
  "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z";

export function FeedDetailActions({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex items-center gap-3.5 px-3 pt-3 text-neutral-900">
      <ToggleIcon
        label={liked ? "좋아요 취소" : "좋아요"}
        on={liked}
        onToggle={() => setLiked((v) => !v)}
        onClassName="fill-red-500 stroke-red-500"
      >
        <path d={HEART} />
      </ToggleIcon>
      <Link
        href={`/demo/instagram/feed/${postId}/comments`}
        scroll={false}
        aria-label="댓글"
        className="-ml-1 grid h-9 w-9 place-items-center active:opacity-50"
      >
        <Icon>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </Icon>
      </Link>
      <button className="-ml-1 grid h-9 w-9 place-items-center">
        <Icon>
          <path
            d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
            strokeLinejoin="round"
          />
        </Icon>
      </button>
      <div className="flex-1" />
      <ToggleIcon
        label={saved ? "저장 취소" : "저장"}
        on={saved}
        onToggle={() => setSaved((v) => !v)}
        onClassName="fill-neutral-900"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </ToggleIcon>
    </div>
  );
}

function ToggleIcon({
  label,
  on,
  onToggle,
  onClassName,
  children,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
  onClassName: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={onToggle}
      className="grid h-9 w-9 place-items-center -ml-1 first:-ml-2"
    >
      <Pop on={on}>
        <Icon className={on ? onClassName : undefined}>{children}</Icon>
      </Pop>
    </button>
  );
}

function Icon({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      {children}
    </svg>
  );
}
