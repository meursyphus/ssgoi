"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import type { UpcomingBirthday } from "@/demo/kakao-talk/state/friend";
import { FriendRow } from "./friend-row";

/** "친구의 생일을 확인해 보세요" — 펼치면 다가오는 생일 목록 */
export function UpcomingBirthdays({
  items,
  countLabel,
}: {
  items: UpcomingBirthday[];
  countLabel: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-2 active:bg-black/[0.03]"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFE9F0] text-lg">
          🎉
        </div>
        <span className="flex-1 truncate text-left text-[14px] text-neutral-900">
          친구의 생일을 확인해 보세요.
        </span>
        <span className="text-[12px] text-neutral-400">{countLabel}</span>
        <ChevronRight
          className={`h-4 w-4 text-neutral-300 transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>
      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="pb-1"
        >
          {items.map(({ friend, dateLabel }) => (
            <li key={friend.id}>
              <FriendRow
                friend={friend}
                action={
                  <span className="flex-shrink-0 rounded-full bg-[#FFE9F0] px-2.5 py-1 text-[11px] font-medium text-[#E0507A]">
                    {dateLabel}
                  </span>
                }
              />
            </li>
          ))}
        </motion.ul>
      )}
    </li>
  );
}
