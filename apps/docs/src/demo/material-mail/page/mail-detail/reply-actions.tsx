"use client";

import { Reply, ReplyAll, Forward, type LucideIcon } from "lucide-react";
import { Link } from "@/lib/link";

const BASE = "/demo/material-mail";

const ACTIONS: { mode: string; label: string; icon: LucideIcon }[] = [
  { mode: "reply", label: "Reply", icon: Reply },
  { mode: "all", label: "Reply all", icon: ReplyAll },
  { mode: "forward", label: "Forward", icon: Forward },
];

export function ReplyActions({ id }: { id: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 px-4 pt-8 pb-10">
      {ACTIONS.map(({ mode, label, icon: Icon }) => (
        <Link
          key={mode}
          href={`${BASE}/compose?reply=${id}&mode=${mode}`}
          scroll={false}
          className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-neutral-300 text-[14px] font-medium text-neutral-800 active:bg-neutral-100"
        >
          <Icon size={18} strokeWidth={2} />
          {label}
        </Link>
      ))}
    </div>
  );
}
