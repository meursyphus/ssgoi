"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User } from "lucide-react";

const BASE = "/demo/pinterest";

export function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === BASE;
  const isSearch = pathname === `${BASE}/search`;

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-20 flex justify-around items-center bg-black/95 backdrop-blur border-t border-white/5 py-2">
      <NavItem
        href={BASE}
        active={isHome}
        icon={<Home className="h-6 w-6" strokeWidth={isHome ? 2.5 : 1.8} />}
      />
      <NavItem
        href={`${BASE}/search`}
        active={isSearch}
        icon={<Search className="h-6 w-6" strokeWidth={isSearch ? 2.5 : 1.8} />}
      />
      <DisabledNavItem icon={<User className="h-6 w-6" strokeWidth={1.8} />} />
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
      className={`flex h-11 w-16 items-center justify-center ${active ? "text-white" : "text-neutral-400"}`}
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
      className="flex h-11 w-16 items-center justify-center text-neutral-600 cursor-not-allowed"
    >
      {icon}
    </button>
  );
}
