"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE = "/demo/yuzu-club";

const NAV = [
  { label: "Home", href: BASE },
  { label: "Flavors", href: `${BASE}/flavors` },
  { label: "Club", href: BASE },
  { label: "Journal", href: BASE },
];

export function FloatingHeader() {
  const pathname = usePathname() ?? BASE;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-5 z-[1001] flex justify-center px-4 lg:top-7">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#1a1a2e] py-2 pr-2 pl-4 shadow-[0_18px_40px_-18px_rgba(26,26,46,0.45)] ring-1 ring-black/5">
        <Link
          href={BASE}
          className="flex items-center gap-2 pr-2 text-[#fff5d6]"
        >
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-full bg-[#ff7a45] text-base"
          >
            🍊
          </span>
          <span className="font-black tracking-tight">YUZU</span>
        </Link>

        <nav className="hidden items-center gap-1 pl-1 md:flex">
          {NAV.map((item) => {
            const active = item.href === pathname;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-[#ffd23f] text-[#1a1a2e]"
                    : "text-[#fff5d6]/70 hover:text-[#fff5d6]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href={`${BASE}/flavors`}
          className="ml-1 rounded-full bg-[#8ed1a4] px-4 py-2 text-xs font-bold tracking-wide text-[#1a1a2e] transition hover:bg-[#7bc592]"
        >
          Join the Club ↗
        </Link>
      </div>
    </header>
  );
}
