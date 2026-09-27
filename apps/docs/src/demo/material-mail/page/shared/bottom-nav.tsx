"use client";

import { usePathname } from "next/navigation";
import { Mail, Video, MessageCircle, Hash } from "lucide-react";
import { Link } from "@/lib/link";

const BASE = "/demo/material-mail";

const items = [
  { label: "Mail", href: BASE, icon: Mail },
  { label: "Meet", href: `${BASE}/meet`, icon: Video },
  { label: "Chat", href: `${BASE}/chat`, icon: MessageCircle },
  { label: "Spaces", href: `${BASE}/spaces`, icon: Hash },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-30 grid h-[70px] grid-cols-4 border-t border-neutral-200/70 bg-white">
      {items.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className="flex flex-col items-center justify-center gap-1"
          >
            <span className="relative flex h-7 w-16 items-center justify-center">
              {/* M3 active indicator: the pill grows out from the icon. */}
              <span
                className={`absolute inset-0 rounded-full bg-indigo-100 transition duration-200 ease-out ${
                  active ? "scale-x-100 opacity-100" : "scale-x-50 opacity-0"
                }`}
              />
              <Icon
                size={20}
                strokeWidth={active ? 2.25 : 2}
                className={`relative transition-colors ${
                  active ? "text-indigo-700" : "text-neutral-500"
                }`}
              />
            </span>
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
