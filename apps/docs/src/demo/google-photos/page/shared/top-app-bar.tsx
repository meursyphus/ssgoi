"use client";

import { Plus, Bell } from "lucide-react";
import { Link } from "@/lib/link";
import { useNotification } from "@/demo/google-photos/state/notification";
import { BASE } from "./paths";

/**
 * Top app bar — pixel 4-color pinwheel logo + 3 action icons on the right:
 * "Create new" sheet, Notifications, and the account sheet.
 */
export function TopAppBar() {
  const notification = useNotification((state) => ({
    hasUnread: state.hasUnread,
  }));
  return (
    <header className="flex h-14 items-center gap-3 px-4">
      <img
        src="/google-photos-icon.svg"
        alt="Google Photos"
        className="h-7 w-7"
      />
      <span className="text-[15px] font-medium text-neutral-700">
        Google Photos
      </span>
      <div className="ml-auto flex items-center gap-1">
        <Link
          href={`${BASE}/new`}
          scroll={false}
          aria-label="Create new"
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 active:bg-black/[0.05]"
        >
          <Plus className="h-5 w-5" />
        </Link>
        <Link
          href={`${BASE}/notifications`}
          scroll={false}
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 active:bg-black/[0.05]"
        >
          <Bell className="h-5 w-5" />
          {notification.hasUnread && (
            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#EA4335]" />
          )}
        </Link>
        <Link
          href={`${BASE}/account`}
          scroll={false}
          aria-label="Account"
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#1A73E8] text-[13px] font-semibold text-white active:opacity-80"
        >
          D
        </Link>
      </div>
    </header>
  );
}
