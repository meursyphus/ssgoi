"use client";

import { Plus, Bell } from "lucide-react";

/**
 * Top app bar — pixel 4-color pinwheel logo + 3 action icons on the right.
 *
 * Display-only: no handlers are wired up.
 */
export function TopAppBar() {
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
        <button
          type="button"
          aria-label="Add"
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 active:bg-black/[0.05]"
        >
          <Plus className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 active:bg-black/[0.05]"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#EA4335]" />
        </button>
        <button
          type="button"
          aria-label="Profile"
          className="ml-1 h-8 w-8 overflow-hidden rounded-full"
        >
          <span className="block h-full w-full bg-gradient-to-r from-neutral-900 from-50% to-white to-50%" />
        </button>
      </div>
    </header>
  );
}
