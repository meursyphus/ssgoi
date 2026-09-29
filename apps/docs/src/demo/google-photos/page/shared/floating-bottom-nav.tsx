"use client";

import { Link } from "@/lib/link";
import { usePathname } from "next/navigation";
import { ImageIcon, Images, Search, Sparkles } from "lucide-react";
import { BASE } from "./paths";

const TABS = [
  { key: "photos", label: "Photos", href: BASE, Icon: ImageIcon },
  {
    key: "collections",
    label: "Collections",
    href: `${BASE}/collections`,
    Icon: Images,
  },
  { key: "create", label: "Create", href: `${BASE}/create`, Icon: Sparkles },
] as const;

/**
 * Floating pill nav with a round Search button beside it, as in the Google
 * Photos app: the current tab is a filled pill led by its icon.
 *
 * Placement: the wrapper is `sticky bottom-0`, so it behaves like
 * `position: fixed` scoped to the mobile frame's scroll container. It is
 * transparent and click-through, and its in-flow height is the room a tab's
 * last row needs to scroll clear of the pill; everywhere else the content
 * scrolls behind it. The pill floats `--nav-offset` above the bottom edge:
 * 8px over the home-indicator inset (`--safe-bottom`), and never closer than
 * 16px where there is none.
 *
 * Size: the wrapper is an inline-size container and every measure scales
 * with its width (`cqw`), from a 288px clip-player frame to a 440px phone,
 * so the pill neither overflows a narrow frame nor looks shrunken on a wide
 * one. The active tab's icon joins its label from 340px up.
 */
export function FloatingBottomNav() {
  const pathname = usePathname();

  return (
    <div className="@container pointer-events-none sticky bottom-0 z-30 h-[calc(var(--nav-offset)+4rem)] [--nav-offset:max(1rem,calc(var(--safe-bottom)+0.5rem))]">
      <div className="absolute inset-x-0 bottom-(--nav-offset) flex items-center justify-center gap-[clamp(6px,2.5cqw_-_1px,10px)] px-[clamp(10px,5cqw_-_4px,20px)] [--tab-h:clamp(36px,11cqw,48px)]">
        <nav className="pointer-events-auto flex items-center rounded-full bg-white p-1 shadow-[0_4px_18px_rgba(0,0,0,0.16)] ring-1 ring-black/5">
          {TABS.map(({ key, label, href, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={key}
                href={href}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-(--tab-h) items-center gap-1.5 whitespace-nowrap rounded-full px-[clamp(8px,6.5cqw_-_9px,18px)] text-[length:clamp(12px,3.2cqw,14px)] font-medium transition-colors ${
                  isActive
                    ? "bg-[#1A73E8] text-white"
                    : "text-neutral-700 active:bg-black/[0.05]"
                }`}
              >
                {isActive && (
                  <Icon
                    aria-hidden
                    strokeWidth={2.25}
                    className="hidden size-[1.15em] shrink-0 @min-[340px]:block"
                  />
                )}
                {label}
              </Link>
            );
          })}
        </nav>
        <Link
          href={`${BASE}/search`}
          scroll={false}
          aria-label="Search"
          className="pointer-events-auto flex size-[calc(var(--tab-h)+8px)] shrink-0 items-center justify-center rounded-full bg-white text-neutral-700 shadow-[0_4px_18px_rgba(0,0,0,0.16)] ring-1 ring-black/5 active:bg-black/[0.05]"
        >
          <Search className="size-[clamp(18px,5cqw,22px)]" />
        </Link>
      </div>
    </div>
  );
}
