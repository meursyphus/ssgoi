"use client";

import type { ReactNode } from "react";
import { Link } from "@/lib/link";
import { Search, UserPlus, Gift, Settings } from "lucide-react";
import type { HomeSegment, MeProfile } from "@/demo/kakao-talk/state/friend";

type Props = {
  me: MeProfile;
  activeTab?: HomeSegment;
  onTabChange?: (tab: HomeSegment) => void;
};

const TABS: { key: HomeSegment; label: string }[] = [
  { key: "friends", label: "친구" },
  { key: "news", label: "소식" },
];

export function TopHeader({ me, activeTab = "friends", onTabChange }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="flex h-12 items-center justify-between pl-4 pr-2">
        <Link
          href={`/demo/kakao-talk/profile/${me.id}`}
          scroll={false}
          className="flex min-w-0 items-center gap-2 active:opacity-70"
        >
          {me.avatar ? (
            <img
              src={me.avatar}
              alt={me.name}
              className="h-7 w-7 rounded-xl bg-neutral-200 object-cover"
            />
          ) : (
            <div className="h-7 w-7 rounded-xl bg-neutral-200" />
          )}
          <span className="truncate text-[17px] font-bold text-neutral-900">
            {me.name}
          </span>
        </Link>
        <div className="flex items-center gap-0.5 text-neutral-700">
          <IconLink label="검색" href="/demo/kakao-talk/search">
            <Search className="h-[20px] w-[20px]" strokeWidth={1.8} />
          </IconLink>
          <IconLink label="친구 추가" href="/demo/kakao-talk/add-friend">
            <UserPlus className="h-[20px] w-[20px]" strokeWidth={1.8} />
          </IconLink>
          <IconButton label="선물" Icon={Gift} accent />
          <IconButton label="설정" Icon={Settings} />
        </div>
      </div>
      <div role="tablist" className="flex gap-2 px-4 pb-2 pt-1">
        {TABS.map((tab) => (
          <PillTab
            key={tab.key}
            label={tab.label}
            active={activeTab === tab.key}
            onClick={() => onTabChange?.(tab.key)}
          />
        ))}
      </div>
    </header>
  );
}

function IconLink({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 hover:bg-black/5 active:bg-black/5"
    >
      {children}
    </Link>
  );
}

function IconButton({
  label,
  Icon,
  accent,
}: {
  label: string;
  Icon: typeof Search;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
    >
      <Icon
        className={`h-[20px] w-[20px] ${
          accent ? "text-[#F95F62]" : "text-neutral-700"
        }`}
        strokeWidth={1.8}
        fill={accent ? "currentColor" : "none"}
      />
    </button>
  );
}

function PillTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`min-w-[56px] rounded-full px-4 py-1 text-[13px] font-semibold transition-colors duration-150 active:scale-95 ${
        active
          ? "bg-neutral-900 text-white"
          : "border border-neutral-200 bg-white text-neutral-600"
      }`}
    >
      {label}
    </button>
  );
}
