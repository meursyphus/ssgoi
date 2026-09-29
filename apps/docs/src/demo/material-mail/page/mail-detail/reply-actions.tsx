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
    // pb-10 (40px) already clears the phone mockup's home indicator, which
    // sits in the bottom 13px, so this row adds no safe-area term. Below 360px
    // (the 288px showcase player) the 14px labels did not fit a third of the
    // row ("Reply all" wrapped, "Forward" ran into its border), so the row
    // tightens there.
    <div className="grid grid-cols-3 gap-2 px-4 pt-8 pb-10 max-[359px]:px-3">
      {ACTIONS.map(({ mode, label, icon: Icon }) => (
        <Link
          key={mode}
          href={`${BASE}/compose?reply=${id}&mode=${mode}`}
          scroll={false}
          className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-neutral-300 text-[14px] font-medium whitespace-nowrap text-neutral-800 active:bg-neutral-100 max-[359px]:gap-1 max-[359px]:text-[13px]"
        >
          <Icon
            size={18}
            strokeWidth={2}
            className="shrink-0 max-[359px]:size-4"
          />
          {label}
        </Link>
      ))}
    </div>
  );
}
