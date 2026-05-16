"use client";

import Link from "next/link";

export function FeedDetailHeader({ backHref }: { backHref: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-neutral-200 px-3 py-3">
      <Link
        href={backHref}
        scroll={false}
        className="-ml-1 grid h-9 w-9 place-items-center text-neutral-900"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M15 19l-7-7 7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      <span className="text-[14px] font-semibold text-neutral-900">게시물</span>
    </div>
  );
}
