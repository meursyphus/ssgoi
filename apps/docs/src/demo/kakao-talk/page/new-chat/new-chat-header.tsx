"use client";

import { X } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { useChat } from "@/demo/kakao-talk/state/chat";

export function NewChatHeader({ selectedIds }: { selectedIds: string[] }) {
  const chat = useChat((state) => ({ actions: state.actions }));
  const count = selectedIds.length;
  return (
    <header className="sticky top-0 z-20 flex h-12 items-center justify-between bg-white px-2">
      <DemoBackLink
        fallback="/demo/kakao-talk/chats"
        aria-label="닫기"
        className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-800 active:bg-black/5"
      >
        <X className="h-5 w-5" strokeWidth={1.8} />
      </DemoBackLink>
      <h1 className="text-[16px] font-semibold text-neutral-900">
        대화상대 선택
      </h1>
      <button
        type="button"
        onClick={() => chat.actions.openRoomWith(selectedIds)}
        className={`flex h-9 items-center gap-1 rounded-full px-3 text-[15px] font-semibold ${
          count > 0 ? "text-neutral-900" : "text-neutral-300"
        }`}
      >
        확인
        {count > 0 && <span className="text-[#E5B800]">{count}</span>}
      </button>
    </header>
  );
}
