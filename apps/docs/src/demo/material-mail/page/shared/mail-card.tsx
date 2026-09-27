"use client";

import { motion } from "motion/react";
import { Paperclip, Star } from "lucide-react";
import { Link } from "@/lib/link";
import { useMail, type MailSimple } from "@/demo/material-mail/state/mail";

const BASE = "/demo/material-mail";

/**
 * Inbox / search row. The star sits under the time, beside the snippet, as
 * in Gmail; it is a sibling of the row link, not inside it.
 */
export function MailCard({ item }: { item: MailSimple }) {
  const mail = useMail((s) => ({ actions: s.actions }));

  return (
    <li className="relative">
      <Link
        href={`${BASE}/m/${item.id}`}
        scroll={false}
        className="flex w-full items-start gap-3 px-4 py-3 text-left active:bg-neutral-100/70"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white ${item.senderColor}`}
        >
          {item.senderInitial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span
              className={`truncate text-[15px] ${
                item.unread
                  ? "font-semibold text-neutral-900"
                  : "font-medium text-neutral-700"
              }`}
            >
              {item.sender}
            </span>
            <span
              className={`shrink-0 text-[12px] ${
                item.unread
                  ? "font-semibold text-neutral-900"
                  : "text-neutral-500"
              }`}
            >
              {item.timeLabel}
            </span>
          </div>
          <div
            className={`truncate text-[14px] ${
              item.unread ? "font-medium text-neutral-900" : "text-neutral-700"
            }`}
          >
            {item.subject}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 pr-7">
            <p className="line-clamp-1 flex-1 text-[13px] text-neutral-500">
              {item.preview}
            </p>
            {item.hasAttachment && (
              <Paperclip
                size={14}
                strokeWidth={2}
                className="shrink-0 text-neutral-400"
              />
            )}
          </div>
        </div>
      </Link>
      <motion.button
        type="button"
        onClick={() => void mail.actions.toggleStar(item.id)}
        aria-label={item.starred ? "Unstar" : "Star"}
        aria-pressed={item.starred}
        whileTap={{ scale: 0.8 }}
        className="absolute right-2 bottom-1 rounded-full p-2 active:bg-neutral-100"
      >
        <motion.span
          className="block"
          initial={false}
          animate={item.starred ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Star
            size={18}
            strokeWidth={1.75}
            fill={item.starred ? "#F5B100" : "none"}
            className={item.starred ? "text-amber-500" : "text-neutral-300"}
          />
        </motion.span>
      </motion.button>
    </li>
  );
}
