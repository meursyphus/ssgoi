"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

export function ComposeFab() {
  return (
    <Link
      href="/demo/material-mail/compose"
      scroll={false}
      className="flex items-center gap-2.5 rounded-2xl bg-indigo-100/95 px-4 py-3.5 text-[15px] font-medium text-indigo-700 shadow-[0_3px_8px_rgba(67,56,202,0.18),_0_1px_2px_rgba(67,56,202,0.12)] active:bg-indigo-200"
      aria-label="Compose"
    >
      <Pencil size={20} strokeWidth={2.25} />
      <span>Compose</span>
    </Link>
  );
}
