"use client";

import { DemoBackLink } from "@/lib/components/demo-back-link";

export function CommentsSheetHeader({
  fallbackHref,
}: {
  fallbackHref: string;
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
      <DemoBackLink
        fallback={fallbackHref}
        aria-label="닫기"
        className="flex w-full justify-center pb-1 pt-2.5"
      >
        <span className="h-1 w-10 rounded-full bg-neutral-300" />
      </DemoBackLink>
      <p className="pb-3 pt-1 text-center text-[15px] font-semibold">댓글</p>
    </div>
  );
}
