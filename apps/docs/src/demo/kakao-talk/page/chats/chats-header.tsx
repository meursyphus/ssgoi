"use client";

import type { ReactNode } from "react";
import { Search, MessageSquarePlus, Settings, Phone } from "lucide-react";
import { Link } from "@/lib/link";
import type { ThreadFilterKey } from "@/demo/kakao-talk/state/chat";

type Props = {
  filter: ThreadFilterKey;
  onFilterChange: (filter: ThreadFilterKey) => void;
};

export function ChatsHeader({ filter, onFilterChange }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between pl-4 pr-2 pt-2">
        <h1 className="text-[22px] font-bold leading-none text-neutral-900">
          채팅
        </h1>
        <div className="flex items-center gap-0.5 text-neutral-700">
          <IconLink label="검색" href="/demo/kakao-talk/search" Icon={Search} />
          <IconLink
            label="새 채팅"
            href="/demo/kakao-talk/new-chat"
            Icon={MessageSquarePlus}
          />
          <button
            type="button"
            aria-label="설정"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
          >
            <Settings className="h-[20px] w-[20px]" strokeWidth={1.8} />
          </button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-2 pt-2">
        <Pill
          label="전체"
          active={filter === "all"}
          onClick={() => onFilterChange("all")}
        />
        <Pill
          label="308"
          leadingEmoji="💬"
          active={filter === "unread"}
          onClick={() => onFilterChange("unread")}
          ariaLabel="안 읽은 채팅"
        />
        <Pill label="ChatGPT" trailingDot />
        <Pill icon={<Phone className="h-4 w-4 text-emerald-500" />} />
        <Pill label="+" />
      </div>
    </header>
  );
}

function IconLink({
  label,
  href,
  Icon,
}: {
  label: string;
  href: string;
  Icon: typeof Search;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 active:bg-black/5"
    >
      <Icon className="h-[20px] w-[20px]" strokeWidth={1.8} />
    </Link>
  );
}

function Pill({
  label,
  active,
  leadingEmoji,
  trailingDot,
  icon,
  onClick,
  ariaLabel,
}: {
  label?: string;
  active?: boolean;
  leadingEmoji?: string;
  trailingDot?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={onClick ? Boolean(active) : undefined}
      className={`flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium transition-colors duration-150 active:scale-95 ${
        active
          ? "border border-neutral-900 bg-neutral-900 text-white"
          : "border border-neutral-200 bg-white text-neutral-700"
      }`}
    >
      {leadingEmoji && <span className="text-[12px]">{leadingEmoji}</span>}
      {icon}
      {label && <span>{label}</span>}
      {trailingDot && (
        <span className="ml-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#F95F62] text-[8px] font-bold text-white">
          N
        </span>
      )}
    </button>
  );
}
