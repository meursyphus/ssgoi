"use client";

import { Home, Newspaper, MapPin, MessageCircle, User } from "lucide-react";
import { Link } from "@/lib/link";
import { BASE } from "@/demo/gamja-market/page/shared/routes";

type TabKey = "home" | "life" | "near" | "chat" | "my";

const ITEMS: { key: TabKey; label: string; href: string; Icon: typeof Home }[] =
  [
    { key: "home", label: "홈", href: BASE, Icon: Home },
    { key: "life", label: "동네생활", href: `${BASE}/life`, Icon: Newspaper },
    { key: "near", label: "내근처", href: `${BASE}/near`, Icon: MapPin },
    { key: "chat", label: "채팅", href: `${BASE}/chats`, Icon: MessageCircle },
    { key: "my", label: "나의당근", href: `${BASE}/my`, Icon: User },
  ];

export function tabForPath(pathname: string): TabKey {
  return ITEMS.find((item) => item.href === pathname)?.key ?? "home";
}

export function BottomNav({ active }: { active: TabKey }) {
  return (
    <nav className="sticky bottom-0 z-30 flex shrink-0 items-center justify-around border-t border-gray-200 bg-white px-2 pb-3 pt-2">
      {ITEMS.map(({ key, label, href, Icon }) => {
        const isActive = key === active;
        const content = (
          <>
            <Icon className="h-5 w-5" strokeWidth={2.2} />
            <span className="text-[10px] font-semibold">{label}</span>
          </>
        );
        const className = `flex flex-col items-center gap-1 px-2 transition-colors ${
          isActive ? "text-[#2db400]" : "text-gray-400 active:text-gray-600"
        }`;
        return isActive ? (
          <span key={key} aria-current="page" className={className}>
            {content}
          </span>
        ) : (
          <Link key={key} href={href} scroll={false} className={className}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
