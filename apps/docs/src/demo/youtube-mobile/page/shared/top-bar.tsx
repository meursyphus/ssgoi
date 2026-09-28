"use client";

import { Bell, Check, Search, Settings, UserPlus } from "lucide-react";
import { Link } from "@/lib/link";
import { BASE, SELF_CHANNEL_ID } from "../../mock-data";
import { openActionSheet } from "./action-sheet";
import { YouTubeBrand } from "./brand";
import { ChannelAvatar } from "./channel-avatar";

function openAccounts() {
  openActionSheet({
    title: "Accounts",
    content: (
      <div className="flex items-center gap-3 px-5 py-2">
        <ChannelAvatar channelId={SELF_CHANNEL_ID} size={40} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium">Alex Morgan</p>
          <p className="text-[12px] text-neutral-500">@alexmakes</p>
        </div>
        <Check className="h-5 w-5 text-[#065fd4]" />
      </div>
    ),
    items: [
      {
        label: "Add account",
        icon: UserPlus,
        toast: "Adding accounts isn't part of this demo",
      },
    ],
  });
}

export function YouTubeTopBar({ profile = false }: { profile?: boolean }) {
  return (
    <header className="flex h-[58px] items-center justify-between bg-white px-4">
      {profile ? (
        <button
          type="button"
          onClick={openAccounts}
          className="rounded-full border border-neutral-300 px-4 py-2 text-[14px] font-medium active:bg-neutral-100"
        >
          Switch account
        </button>
      ) : (
        <YouTubeBrand />
      )}
      <div className="flex items-center gap-1 text-neutral-950">
        <Link
          href={`${BASE}/notifications`}
          scroll={false}
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
        >
          <Bell className="h-[23px] w-[23px]" strokeWidth={2} />
          <span className="absolute right-0.5 top-0.5 rounded-full bg-[#e9002b] px-1.5 text-[9px] font-bold leading-[16px] text-white">
            9+
          </span>
        </Link>
        <Link
          href={`${BASE}/search`}
          scroll={false}
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
        >
          <Search className="h-[24px] w-[24px]" strokeWidth={2} />
        </Link>
        {profile && (
          <span className="flex h-10 w-10 items-center justify-center">
            <Settings className="h-[23px] w-[23px]" strokeWidth={2} />
          </span>
        )}
      </div>
    </header>
  );
}
