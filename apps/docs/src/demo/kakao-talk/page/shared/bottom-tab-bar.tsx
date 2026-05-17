"use client";

import Link from "next/link";
import {
  User,
  MessageCircle,
  Video,
  ShoppingBag,
  MoreHorizontal,
} from "lucide-react";

type ActiveTab = "friends" | "chats" | "shorts" | "shop" | "more";

type Tab = {
  key: ActiveTab;
  label: string;
  href?: string;
  Icon: typeof User;
  badge?: number | "dot";
};

const TABS: Tab[] = [
  { key: "friends", label: "친구", href: "/demo/kakao-talk", Icon: User },
  {
    key: "chats",
    label: "채팅",
    href: "/demo/kakao-talk/chats",
    Icon: MessageCircle,
    badge: 308,
  },
  { key: "shorts", label: "쇼츠", Icon: Video, badge: 50 },
  { key: "shop", label: "쇼핑", Icon: ShoppingBag },
  { key: "more", label: "더보기", Icon: MoreHorizontal, badge: "dot" },
];

function Badge({ value }: { value: number | "dot" }) {
  if (value === "dot") {
    return (
      <span className="absolute right-3 top-1 h-1.5 w-1.5 rounded-full bg-[#F95F62]" />
    );
  }
  return (
    <span className="absolute right-1.5 top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#F95F62] px-1 text-[9px] font-bold text-white">
      {value > 99 ? "99+" : value}
    </span>
  );
}

export function BottomTabBar({ active }: { active: ActiveTab }) {
  return (
    <nav className="sticky bottom-0 z-30 grid grid-cols-5 bg-white">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const content = (
          <div className="relative flex h-14 items-center justify-center">
            <tab.Icon
              className={`h-6 w-6 ${
                isActive ? "text-neutral-900" : "text-neutral-400"
              }`}
              strokeWidth={isActive ? 2.4 : 1.8}
              fill={isActive && tab.key === "friends" ? "currentColor" : "none"}
            />
            {tab.badge !== undefined && <Badge value={tab.badge} />}
          </div>
        );

        if (tab.href && !isActive) {
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-label={tab.label}
              className="active:bg-black/[0.04]"
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={tab.key}
            type="button"
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
            className="active:bg-black/[0.04]"
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
