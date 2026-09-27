"use client";

import type { ReactNode } from "react";
import { Link } from "@/lib/link";

const BASE = "/demo/instagram";
const FIRST_REEL = "r-001";

type Tab = "home" | "explore" | "profile";

export function ProfileBottomBar({
  avatar,
  active = "profile",
  profileHref = `${BASE}/profile/deaseungseung94`,
}: {
  avatar?: string;
  active?: Tab;
  profileHref?: string;
}) {
  return (
    <div className="flex items-center justify-around border-t border-neutral-200 bg-white px-2 pb-2 pt-2">
      <BottomLink href={`${BASE}/home`} label="홈">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill={active === "home" ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path
            d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z"
            strokeLinejoin="round"
          />
        </svg>
      </BottomLink>
      <BottomLink href={`${BASE}/reels/${FIRST_REEL}`} label="릴스">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <rect x="4.5" y="3.5" width="15" height="17" rx="2.5" />
          <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
        </svg>
      </BottomLink>
      <button
        type="button"
        aria-label="메시지"
        className="grid h-10 w-10 place-items-center text-neutral-900"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path
            d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <BottomLink href={`${BASE}/explore`} label="검색">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active === "explore" ? 2.6 : 1.6}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-5-5" strokeLinecap="round" />
        </svg>
      </BottomLink>
      <BottomLink href={profileHref} label="프로필">
        <div
          className={`h-7 w-7 overflow-hidden rounded-full ${
            active === "profile" ? "ring-2 ring-neutral-900" : ""
          }`}
        >
          {avatar ? (
            <img src={avatar} alt="me" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full animate-pulse bg-neutral-200" />
          )}
        </div>
      </BottomLink>
    </div>
  );
}

function BottomLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-label={label}
      className="grid h-10 w-10 place-items-center text-neutral-900 transition-transform active:scale-90"
    >
      {children}
    </Link>
  );
}
