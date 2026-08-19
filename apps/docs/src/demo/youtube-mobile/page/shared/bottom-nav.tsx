"use client";

import { Link } from "@/lib/link";
import { usePathname } from "next/navigation";
import { Home, Plus, User, Video } from "lucide-react";
import { ShortsMark } from "./brand";

const BASE = "/demo/youtube-mobile";

const TABS = [
  { key: "home", label: "Home", href: BASE, Icon: Home },
  {
    key: "shorts",
    label: "Shorts",
    href: `${BASE}/shorts`,
    Icon: ShortsMark,
  },
  { key: "create", label: "Create", href: `${BASE}/create`, Icon: Plus },
  {
    key: "subscriptions",
    label: "Subscriptions",
    href: `${BASE}/subscriptions`,
    Icon: Video,
  },
  { key: "profile", label: "You", href: `${BASE}/profile`, Icon: User },
] as const;

export function YouTubeBottomNav() {
  const pathname = usePathname();
  const dark = pathname === `${BASE}/shorts`;

  return (
    <nav
      className={`sticky bottom-0 z-40 grid h-[68px] shrink-0 grid-cols-5 border-t ${
        dark
          ? "border-white/10 bg-[#0f0f0f] text-white"
          : "border-neutral-200 bg-white text-neutral-950"
      }`}
    >
      {TABS.map((tab) => {
        const isCreate = tab.key === "create";
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
            className="flex min-w-0 flex-col items-center justify-center gap-0.5 active:opacity-60"
          >
            <span
              className={`flex items-center justify-center ${
                isCreate
                  ? dark
                    ? "h-10 w-10 rounded-full bg-white/10"
                    : "h-10 w-10 rounded-full bg-neutral-100"
                  : "h-8 w-10"
              }`}
            >
              <tab.Icon
                className={`${tab.key === "shorts" ? "h-7 w-7" : "h-6 w-6"} ${
                  isActive ? "fill-current" : ""
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </span>
            {!isCreate && (
              <span className="max-w-full truncate px-0.5 text-[10px] leading-4">
                {tab.label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
