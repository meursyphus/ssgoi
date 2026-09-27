"use client";

import { usePathname } from "next/navigation";
import { Heart, MessageCircle, Plane, Search, User } from "lucide-react";
import { Link } from "@/lib/link";
import { routes } from "./routes";

const ITEMS = [
  { href: routes.explore, label: "Explore", Icon: Search },
  { href: routes.wishlists, label: "Wishlists", Icon: Heart },
  { href: routes.trips, label: "Trips", Icon: Plane },
  { href: routes.messages, label: "Messages", Icon: MessageCircle },
  { href: routes.profile, label: "Profile", Icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-30 flex shrink-0 items-center justify-around border-t border-neutral-200 bg-white px-2 pb-3 pt-2">
      {ITEMS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-1 px-2 transition-[color,transform] duration-150 active:scale-90 ${
              active ? "text-[#FF385C]" : "text-neutral-400"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={2.2} />
            <span className="text-[10px] font-semibold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
