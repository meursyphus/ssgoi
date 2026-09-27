"use client";

import { DemoBackLink } from "@/lib/components/demo-back-link";

export function FeedDetailHeader({ fallbackHref }: { fallbackHref: string }) {
  // 그리드·태그됨·탐색·홈 어디서 열었든 온 곳으로 돌아가야 zoom이 원래 타일로 접힌다
  return (
    <div className="flex items-center gap-3 border-b border-neutral-200 px-3 py-3">
      <DemoBackLink
        fallback={fallbackHref}
        aria-label="뒤로"
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
      </DemoBackLink>
      <span className="text-[14px] font-semibold text-neutral-900">게시물</span>
    </div>
  );
}
