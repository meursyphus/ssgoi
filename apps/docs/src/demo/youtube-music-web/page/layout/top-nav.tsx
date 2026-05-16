"use client";

import Link from "next/link";
import { Bell, Cast, Menu, Search } from "lucide-react";

export function TopNav() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/5 bg-[#030303] px-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
          aria-label="menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href="/demo/youtube-music-web"
          className="flex items-center gap-2 px-1"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#FF0000">
              <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm-2 8.4 7 3.6-7 3.6V8.4Z" />
            </svg>
          </span>
          <span className="text-[18px] font-semibold tracking-tight">
            Music
          </span>
        </Link>
      </div>

      <div className="flex max-w-2xl flex-1 items-center">
        <div className="flex h-10 w-full items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white/70 transition-colors focus-within:border-white/40">
          <Search className="h-4 w-4 text-white/60" />
          <input
            type="text"
            placeholder="노래, 앨범, 아티스트, 팟캐스트 검색"
            className="flex-1 bg-transparent placeholder:text-white/45 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <IconButton label="cast">
          <Cast className="h-5 w-5" />
        </IconButton>
        <IconButton label="notifications">
          <Bell className="h-5 w-5" />
        </IconButton>
        <button
          type="button"
          className="ml-2 flex h-9 items-center gap-2 rounded-full border border-white/15 px-3 text-sm font-medium hover:bg-white/5"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 text-[12px] font-semibold">
            M
          </span>
          <span className="hidden sm:inline">로그인</span>
        </button>
      </div>
    </header>
  );
}

function IconButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
      aria-label={label}
    >
      {children}
    </button>
  );
}
