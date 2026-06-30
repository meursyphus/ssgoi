"use client";

import { Link } from "@/lib/link";
import { PenLine } from "lucide-react";

export function ComposeFab() {
  return (
    <Link
      href="/demo/voyage/compose"
      scroll={false}
      className="flex items-center gap-2 rounded-full bg-[#FF5A5F] px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(255,90,95,0.7)] active:bg-[#e84e53]"
      aria-label="Write a new story"
    >
      <PenLine size={19} strokeWidth={2.5} />
      <span>New story</span>
    </Link>
  );
}
