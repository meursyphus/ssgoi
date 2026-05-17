"use client";

import { Search, MessageSquarePlus, Settings, Phone } from "lucide-react";

export function ChatsHeader() {
  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between pl-4 pr-2 pt-2">
        <h1 className="text-[22px] font-bold leading-none text-neutral-900">
          채팅
        </h1>
        <div className="flex items-center gap-0.5 text-neutral-700">
          <IconButton label="검색" Icon={Search} />
          <IconButton label="새 채팅" Icon={MessageSquarePlus} />
          <IconButton label="설정" Icon={Settings} />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-2 pt-2">
        <Pill label="전체" active />
        <Pill label="308" leadingEmoji="💬" />
        <Pill label="ChatGPT" trailingDot />
        <Pill icon={<Phone className="h-4 w-4 text-emerald-500" />} />
        <Pill label="+" />
      </div>
    </header>
  );
}

function IconButton({ label, Icon }: { label: string; Icon: typeof Search }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
    >
      <Icon className="h-[20px] w-[20px]" strokeWidth={1.8} />
    </button>
  );
}

function Pill({
  label,
  active,
  leadingEmoji,
  trailingDot,
  icon,
}: {
  label?: string;
  active?: boolean;
  leadingEmoji?: string;
  trailingDot?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium ${
        active
          ? "bg-neutral-900 text-white"
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
