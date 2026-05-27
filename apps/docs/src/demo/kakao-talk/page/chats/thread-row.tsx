import { Link } from "@/lib/link";
import { Pin, BellOff } from "lucide-react";
import type { ChatThreadSimple } from "@/demo/kakao-talk/api/chat";

export function ThreadRow({ thread }: { thread: ChatThreadSimple }) {
  return (
    <Link
      href={`/demo/kakao-talk/chats/${thread.id}`}
      className="flex items-start gap-3 px-4 py-3 active:bg-black/[0.03]"
    >
      <img
        src={thread.partnerAvatar}
        alt={thread.partnerName}
        className="h-12 w-12 flex-shrink-0 rounded-2xl bg-neutral-200 object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1">
            <span className="truncate text-[15px] font-semibold text-neutral-900">
              {thread.partnerName}
            </span>
            {thread.memberCount ? (
              <span className="flex-shrink-0 text-[13px] text-neutral-400">
                {thread.memberCount}
              </span>
            ) : null}
            {thread.pinned && (
              <Pin className="h-3 w-3 flex-shrink-0 fill-neutral-400 text-neutral-400" />
            )}
            {thread.muted && (
              <BellOff className="h-3 w-3 flex-shrink-0 text-neutral-400" />
            )}
          </div>
          <span className="flex-shrink-0 text-[11px] text-neutral-400">
            {thread.lastMessageAt}
          </span>
        </div>
        <div className="mt-0.5 flex items-end justify-between gap-2">
          <p className="line-clamp-1 flex-1 text-[13px] text-neutral-500">
            {thread.lastMessage}
          </p>
          {thread.unreadCount > 0 && (
            <span className="flex h-[18px] min-w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-[#F95F62] px-1.5 text-[10px] font-bold text-white">
              {thread.unreadCount > 99 ? "99+" : thread.unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
