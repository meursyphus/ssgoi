"use client";

import { X } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";

export function ViewerHeader({
  threadId,
  senderName,
  sentAt,
}: {
  threadId: string;
  senderName: string;
  sentAt: string;
}) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center bg-black/80 px-2 text-white">
      <DemoBackLink
        fallback={`/demo/kakao-talk/chats/${threadId}`}
        aria-label="닫기"
        className="flex h-10 w-10 items-center justify-center rounded-full active:bg-white/10"
      >
        <X className="h-6 w-6" strokeWidth={1.8} />
      </DemoBackLink>
      <div className="flex min-w-0 flex-1 flex-col items-center pr-10">
        <span className="truncate text-[14px] font-semibold">{senderName}</span>
        <span className="text-[11px] text-white/60">{sentAt}</span>
      </div>
    </header>
  );
}
