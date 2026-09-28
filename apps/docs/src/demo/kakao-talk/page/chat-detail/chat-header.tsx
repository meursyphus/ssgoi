"use client";

import { ChevronLeft, Search, Menu, Upload } from "lucide-react";
import { Link } from "@/lib/link";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import type { ChatThreadDetail } from "@/demo/kakao-talk/api/chat";

export function ChatHeader({ thread }: { thread: ChatThreadDetail }) {
  return (
    <header className="sticky top-0 z-10 flex h-12 items-center bg-[#A4BFD2]/95 px-1 backdrop-blur">
      <DemoBackLink
        fallback="/demo/kakao-talk/chats"
        aria-label="뒤로"
        className="flex h-9 items-center gap-0 rounded-full pl-1 pr-2 text-neutral-800 hover:bg-black/5"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="text-[14px] font-medium">308</span>
      </DemoBackLink>
      <div className="flex flex-1 items-baseline justify-center gap-1">
        <h1 className="text-[15px] font-semibold text-neutral-900">
          {thread.partnerName}
        </h1>
        {thread.memberCount ? (
          <span className="text-[12px] text-neutral-700">
            {thread.memberCount}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-0.5 text-neutral-800">
        <IconBtn label="공유">
          <Upload className="h-[18px] w-[18px]" />
        </IconBtn>
        <IconBtn label="검색">
          <Search className="h-[18px] w-[18px]" />
        </IconBtn>
        <Link
          href={`/demo/kakao-talk/chats/${thread.id}/drawer`}
          scroll={false}
          aria-label="채팅방 서랍"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 active:bg-black/5"
        >
          <Menu className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </header>
  );
}

function IconBtn({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
    >
      {children}
    </button>
  );
}
