"use client";

import { usePathname } from "next/navigation";
import { Compass, Bookmark, Map, User } from "lucide-react";
import { Link } from "@/lib/link";
import { BASE } from "../shared/routes";

const items = [
  { label: "Explore", icon: Compass, href: BASE },
  { label: "Saved", icon: Bookmark, href: `${BASE}/saved` },
  { label: "Trips", icon: Map, href: `${BASE}/trips` },
  { label: "Profile", icon: User, href: `${BASE}/profile` },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    // pb-safe: the white bar runs under the home indicator while the icons
    // and labels stay above it, like a native tab bar.
    <nav className="sticky bottom-0 z-30 grid grid-cols-4 border-t border-neutral-200/70 bg-white pb-safe">
      {items.map(({ label, icon: Icon, href }) => {
        const active = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className="flex flex-col items-center gap-1 py-2.5 active:opacity-70"
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 2}
              className={active ? "text-[#FF5A5F]" : "text-neutral-400"}
            />
            <span
              className={`text-[11px] ${
                active ? "font-semibold text-neutral-900" : "text-neutral-500"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
