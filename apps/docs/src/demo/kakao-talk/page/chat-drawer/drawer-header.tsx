"use client";

import { ChevronLeft } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";

export function DrawerHeader({
  threadId,
  title,
}: {
  threadId: string;
  title: string;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-12 items-center bg-[#F2F3F5]/95 px-1 backdrop-blur">
      <DemoBackLink
        fallback={`/demo/kakao-talk/chats/${threadId}`}
        aria-label="뒤로"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-neutral-800 active:bg-black/5"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={1.8} />
      </DemoBackLink>
      <div className="flex min-w-0 flex-1 flex-col items-center pr-9">
        <h1 className="text-[15px] font-semibold leading-tight text-neutral-900">
          채팅방 서랍
        </h1>
        <p className="max-w-full truncate text-[11px] text-neutral-500">
          {title}
        </p>
      </div>
    </header>
  );
}
