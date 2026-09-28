"use client";

import { useState, type ReactNode } from "react";
import {
  Bell,
  MessageSquareText,
  Repeat2,
  Search,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/lib/link";
import { BASE, commentsFor, compactCount, findChannel } from "../../mock-data";
import type { MockShort } from "../../mock-data";
import { MoreButton, openActionSheet } from "../shared/action-sheet";
import { ChannelAvatar } from "../shared/channel-avatar";
import { CommentList } from "../shared/comment-list";
import { SubscribeButton } from "../shared/subscribe-button";

function RailButton({
  label,
  caption,
  pressed,
  onClick,
  children,
}: {
  label: string;
  caption?: string;
  pressed?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className="flex flex-col items-center gap-1"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 transition-transform duration-150 active:scale-90">
        {children}
      </span>
      {caption && <span className="text-[11px] font-medium">{caption}</span>}
    </button>
  );
}

/**
 * Full-screen Shorts player shared by the Shorts tab and /shorts/[id]. The
 * detail page passes `zoomKey` so the image is the single zoom enter marker,
 * and `toScreenEdge` because nothing sits below it there: the rail and the
 * caption then clear the home-indicator inset (on the tab the nav does).
 */
export function ShortPlayer({
  short,
  leading,
  zoomKey,
  showBell = false,
  toScreenEdge = false,
  className = "",
}: {
  short: MockShort;
  leading: ReactNode;
  zoomKey?: string;
  showBell?: boolean;
  toScreenEdge?: boolean;
  className?: string;
}) {
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);
  const likes = short.likes + (reaction === "like" ? 1 : 0);

  const openComments = () =>
    openActionSheet({
      title: `Comments ${short.comments}`,
      content: <CommentList comments={commentsFor(short.id)} />,
    });

  return (
    <main
      className={`relative overflow-hidden bg-[#0f0f0f] text-white ${className}`}
    >
      <img
        src={short.image}
        alt=""
        width={600}
        height={920}
        data-zoom-enter-key={zoomKey}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75" />

      <header className="relative z-10 flex h-14 items-center justify-between px-2">
        {leading}
        <div className="flex items-center">
          <Link
            href={`${BASE}/search`}
            scroll={false}
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-white/15"
          >
            <Search className="h-6 w-6" />
          </Link>
          {showBell && (
            <Link
              href={`${BASE}/notifications`}
              scroll={false}
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-full active:bg-white/15"
            >
              <Bell className="h-6 w-6" />
            </Link>
          )}
          <MoreButton
            menu="player"
            className="h-10 w-10 active:bg-white/15"
            iconClassName="h-6 w-6"
          />
        </div>
      </header>

      <div
        className={`absolute right-3 z-10 flex flex-col items-center gap-4 ${
          toScreenEdge ? "bottom-safe-6" : "bottom-6"
        }`}
      >
        <RailButton
          label="Like"
          caption={compactCount(likes)}
          pressed={reaction === "like"}
          onClick={() => setReaction(reaction === "like" ? null : "like")}
        >
          <ThumbsUp
            className="h-6 w-6"
            fill={reaction === "like" ? "currentColor" : "none"}
          />
        </RailButton>
        <RailButton
          label="Dislike"
          caption="Dislike"
          pressed={reaction === "dislike"}
          onClick={() => setReaction(reaction === "dislike" ? null : "dislike")}
        >
          <ThumbsDown
            className="h-6 w-6"
            fill={reaction === "dislike" ? "currentColor" : "none"}
          />
        </RailButton>
        <RailButton
          label="Comments"
          caption={short.comments}
          onClick={openComments}
        >
          <MessageSquareText className="h-6 w-6" />
        </RailButton>
        <RailButton
          label="Share"
          caption="Share"
          onClick={() => toast("Link copied")}
        >
          <Share2 className="h-6 w-6" />
        </RailButton>
        <Link
          href={`${BASE}/create`}
          scroll={false}
          aria-label="Remix"
          className="flex flex-col items-center gap-1"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 active:scale-90">
            <Repeat2 className="h-6 w-6" />
          </span>
          <span className="text-[11px] font-medium">Remix</span>
        </Link>
      </div>

      <div
        className={`absolute left-4 right-20 z-10 ${
          toScreenEdge ? "bottom-safe-5" : "bottom-5"
        }`}
      >
        <div className="mb-3 flex items-center gap-2">
          <Link
            href={`${BASE}/channel/${short.channelId}`}
            scroll={false}
            className="flex min-w-0 items-center gap-2 active:opacity-70"
          >
            <ChannelAvatar
              channelId={short.channelId}
              size={32}
              className="ring-1 ring-white"
            />
            <span className="truncate text-[13px] font-semibold">
              {findChannel(short.channelId)?.handle}
            </span>
          </Link>
          <SubscribeButton channelId={short.channelId} tone="overlay" />
        </div>
        <p className="text-[14px] font-medium leading-5">{short.caption}</p>
        <p className="mt-2 text-[12px] text-white/85">
          Original sound · {short.channel}
        </p>
      </div>
    </main>
  );
}
