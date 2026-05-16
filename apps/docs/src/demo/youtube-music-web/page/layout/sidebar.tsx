"use client";

import { Compass, Home, Library, Music2, Podcast, Radio } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "홈", icon: Home, href: "/demo/youtube-music-web" },
  {
    label: "둘러보기",
    icon: Compass,
    href: "/demo/youtube-music-web?tab=explore",
  },
  {
    label: "라이브러리",
    icon: Library,
    href: "/demo/youtube-music-web?tab=library",
  },
];

const SHORTCUTS = [
  { label: "Liked Music", icon: Music2 },
  { label: "Lofi Sessions", icon: Radio },
  { label: "Morning Brew", icon: Podcast },
];

export function Sidebar() {
  const pathname = usePathname();
  const onHome = pathname === "/demo/youtube-music-web";

  return (
    <nav className="hidden w-60 shrink-0 flex-col border-r border-white/5 bg-[#030303] py-4 md:flex">
      <ul className="px-2">
        {NAV.map(({ label, icon: Icon, href }) => {
          const active =
            href === "/demo/youtube-music-web"
              ? onHome
              : pathname.startsWith(href);
          return (
            <li key={label}>
              <Link
                href={href}
                className={[
                  "flex h-10 items-center gap-4 rounded-md px-3 text-sm font-medium",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:bg-white/5",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.6} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 px-5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
        Your Shortcuts
      </div>
      <ul className="mt-1 px-2">
        {SHORTCUTS.map(({ label, icon: Icon }) => (
          <li key={label}>
            <button
              type="button"
              className="flex h-10 w-full items-center gap-4 rounded-md px-3 text-left text-sm text-white/80 hover:bg-white/5"
            >
              <Icon className="h-5 w-5 text-white/70" />
              <span className="truncate">{label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-white/5 px-5 pt-4 text-[11px] leading-relaxed text-white/40">
        <p>Made with ssgoi</p>
      </div>
    </nav>
  );
}
