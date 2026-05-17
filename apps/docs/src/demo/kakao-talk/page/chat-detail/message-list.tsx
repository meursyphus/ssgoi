import { Fragment } from "react";
import type { ChatMessage } from "@/demo/kakao-talk/api/chat";
import { MessageBubble } from "./message-bubble";

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3">
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
