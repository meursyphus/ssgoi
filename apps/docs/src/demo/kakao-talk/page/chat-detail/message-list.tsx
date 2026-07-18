"use client";

import { Fragment, useEffect, useRef } from "react";
import type { ChatMessage } from "@/demo/kakao-talk/api/chat";
import { MessageBubble } from "./message-bubble";

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Deliberately mirror real chat screens: the history mounts first, then a
    // passive effect reads its laid-out height and opens at the newest message.
    // This also keeps the showcase as a regression fixture for WAAPI startup
    // while layout-dependent mount work is happening.
    container.scrollTo({ top: container.scrollHeight });
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      data-kakao-message-list
      className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 py-3"
    >
      {messages.map((m) => (
        <Fragment key={m.id}>
          {m.dateDividerLabel && <DateDivider label={m.dateDividerLabel} />}
          <MessageBubble message={m} />
        </Fragment>
      ))}
    </div>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-2">
      <span className="flex items-center gap-1 rounded-full bg-black/15 px-3 py-1 text-[11px] text-white/90">
        {label}
        <span className="opacity-60">›</span>
      </span>
    </div>
  );
}
