"use client";

import { useState } from "react";
import { ChevronDown, Reply } from "lucide-react";
import { Link } from "@/lib/link";
import type { MailDetail } from "@/demo/material-mail/state/mail";

const BASE = "/demo/material-mail";

export function SenderRow({ mail }: { mail: MailDetail }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white ${mail.senderColor}`}
        >
          {mail.senderInitial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="truncate text-[15px] font-medium text-neutral-900">
              {mail.fromName}
            </span>
            <span className="shrink-0 text-[12px] text-neutral-500">
              {mail.timeLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="-ml-1 flex items-center gap-0.5 rounded px-1 text-[13px] text-neutral-500 active:bg-neutral-100"
          >
            to {mail.toLabel}
            <ChevronDown
              size={16}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        <Link
          href={`${BASE}/compose?reply=${mail.id}&mode=reply`}
          scroll={false}
          className="-mr-1 rounded-full p-2 text-neutral-700 active:bg-neutral-100"
          aria-label="Reply"
        >
          <Reply size={20} strokeWidth={2} />
        </Link>
      </div>
      {open && (
        <dl className="mt-3 grid grid-cols-[52px_1fr] gap-y-1.5 rounded-xl border border-neutral-200 px-3 py-2.5 text-[13px]">
          <dt className="text-neutral-500">From</dt>
          <dd className="min-w-0 break-words text-neutral-800">
            {mail.fromName}{" "}
            <span className="text-neutral-500">&lt;{mail.fromEmail}&gt;</span>
          </dd>
          <dt className="text-neutral-500">To</dt>
          <dd className="text-neutral-800">
            {mail.toLabel === "me" ? "me@example.com" : mail.toLabel}
          </dd>
          <dt className="text-neutral-500">Date</dt>
          <dd className="text-neutral-800">{mail.dateLabel}</dd>
        </dl>
      )}
    </div>
  );
}
