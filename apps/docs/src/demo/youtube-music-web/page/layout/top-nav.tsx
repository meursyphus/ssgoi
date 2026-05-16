"use client";

import Link from "next/link";
import { Cast, Menu, Mic, Search } from "lucide-react";

export function TopNav() {
  return (
    <header className="grid h-16 shrink-0 grid-cols-[240px_1fr_auto] items-center border-b border-white/[0.06] bg-[#030303]">
      <div className="flex items-center gap-1 pl-3">
        <button
          type="button"
          aria-label="menu"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/85 hover:bg-white/[0.08]"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href="/demo/youtube-music-web"
          className="ml-1 flex items-center gap-2 px-1"
        >
          <span className="flex h-7 w-7 items-center justify-center">
            <svg viewBox="0 0 24 24" fill="#FF0033" className="h-6 w-6">
              <circle cx="12" cy="12" r="12" />
              <path d="M10 8.4l7 3.6-7 3.6V8.4Z" fill="#0a0a0a" />
            </svg>
          </span>
          <span className="text-[17px] font-semibold tracking-tight">
            Music
          </span>
        </Link>
      </div>

      <div className="px-6">
        <div className="mx-auto flex h-10 max-w-3xl items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 transition-colors focus-within:border-white/30 focus-within:bg-white/[0.06]">
          <Search className="h-4 w-4 text-white/65" />
          <input
            type="text"
            readOnly
            placeholder="Search songs, albums, artists, podcasts"
            className="flex-1 cursor-default bg-transparent text-[13px] placeholder:text-white/45 focus:outline-none"
          />
          <Mic className="h-4 w-4 text-white/55" />
        </div>
      </div>

      <div className="flex items-center gap-1 pr-4">
        <button
          type="button"
          aria-label="cast"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/85 hover:bg-white/[0.08]"
        >
          <Cast className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="account"
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-black"
        >
          M
        </button>
      </div>
    </header>
  );
}
