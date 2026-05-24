"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User } from "lucide-react";

function HomeIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="currentColor"
        aria-hidden
      >
        <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 .22.53V20a1.5 1.5 0 0 1-1.5 1.5h-3.75A1.5 1.5 0 0 1 13.5 20v-3.75a1.5 1.5 0 0 0-1.5-1.5h-.06a1.5 1.5 0 0 0-1.44 1.5V20a1.5 1.5 0 0 1-1.5 1.5H5.25A1.5 1.5 0 0 1 3.75 20v-8.13c0-.2.08-.39.22-.53l7.5-7.5z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M3.75 11.94 12 4.5l8.25 7.44V20a.75.75 0 0 1-.75.75h-4.5v-5.25a1.5 1.5 0 0 0-1.5-1.5h-3a1.5 1.5 0 0 0-1.5 1.5v5.25h-4.5a.75.75 0 0 1-.75-.75v-8.06z" />
    </svg>
  );
}

const BASE = "/demo/pinterest";

export function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === BASE;
  const isSearch = pathname === `${BASE}/search`;

  return (
    <nav className="sticky bottom-0 z-10 flex justify-around items-center bg-white/95 backdrop-blur border-t border-black/5 py-2">
      <NavItem
        href={BASE}
        active={isHome}
        icon={<HomeIcon active={isHome} />}
      />
      <NavItem
        href={`${BASE}/search`}
        active={isSearch}
        icon={<Search className="h-7 w-7" strokeWidth={isSearch ? 2.8 : 2.2} />}
      />
      <DisabledNavItem icon={<User className="h-7 w-7" strokeWidth={2.2} />} />
    </nav>
  );
}

function NavItem({
  href,
  active,
  icon,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex h-11 w-16 items-center justify-center ${active ? "text-black" : "text-neutral-700"}`}
    >
      {icon}
    </Link>
  );
}

function DisabledNavItem({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className="flex h-11 w-16 items-center justify-center text-neutral-300 cursor-not-allowed"
    >
      {icon}
    </button>
  );
}
