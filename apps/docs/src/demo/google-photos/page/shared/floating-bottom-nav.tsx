"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

const BASE = "/demo/google-photos";

const TABS = [
  { key: "photos", label: "Photos", href: BASE },
  { key: "collections", label: "Collections", href: `${BASE}/collections` },
  { key: "create", label: "Create", href: `${BASE}/create` },
] as const;

/**
 * Floating pill bottom nav. The wrapper is `sticky bottom-0 h-0` so it owns
 * no flow space — content scrolls fully behind it — while the inner
 * absolute layer rides the wrapper's bottom edge, which sticky pins to the
 * scroll viewport bottom. Net effect: behaves like `position: fixed` but
 * scoped to the mobile-frame's scroll container instead of the page viewport.
 */
export function FloatingBottomNav() {
  const pathname = usePathname();

  return (
    <div className="sticky bottom-0 z-30 h-0">
      <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 px-4">
        <nav className="pointer-events-auto flex items-center rounded-full bg-white p-1 shadow-[0_4px_18px_rgba(0,0,0,0.16)] ring-1 ring-black/5">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.key}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-10 min-w-[78px] items-center justify-center rounded-full px-4 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#1A73E8] text-white"
                    : "text-neutral-700 active:bg-black/[0.05]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          aria-label="Search"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-neutral-700 shadow-[0_4px_18px_rgba(0,0,0,0.16)] ring-1 ring-black/5 active:bg-black/[0.05]"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
