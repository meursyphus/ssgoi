"use client";

import { Menu, Search } from "lucide-react";
import { Link } from "@/lib/link";
import { useMail } from "@/demo/material-mail/state/mail";

const BASE = "/demo/material-mail";

/**
 * Inbox: the rounded "Search in mail" bar. Meet / Chat / Spaces: a plain
 * title row. Both open the drawer (menu) and the account card (avatar).
 */
export function TopBar({ title }: { title?: string }) {
  const mail = useMail((s) => ({ actions: s.actions }));

  const menu = (
    <button
      type="button"
      onClick={() => mail.actions.openDrawer()}
      className="-ml-1.5 rounded-full p-1.5 text-neutral-700 active:bg-neutral-100"
      aria-label="Menu"
    >
      <Menu size={20} strokeWidth={2.25} />
    </button>
  );
  const avatar = (
    <button
      type="button"
      onClick={() => mail.actions.openAccount()}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-[13px] font-semibold text-white active:ring-4 active:ring-indigo-200"
      aria-label="Account"
    >
      M
    </button>
  );

  if (title) {
    return (
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-[#FAFAFE] px-5 pt-4 pb-3">
        {menu}
        <h1 className="flex-1 text-[20px] text-neutral-900">{title}</h1>
        {avatar}
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 bg-[#FAFAFE] px-4 pt-4 pb-3">
      <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.04)]">
        {menu}
        <Link
          href={`${BASE}/search`}
          scroll={false}
          onClick={() => mail.actions.resetSearch()}
          className="flex flex-1 items-center gap-2 text-[15px] text-neutral-500"
        >
          <Search size={18} strokeWidth={2.25} />
          <span>Search in mail</span>
        </Link>
        {avatar}
      </div>
    </div>
  );
}
