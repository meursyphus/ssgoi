"use client";

import { Paperclip, Star } from "lucide-react";
import { toast } from "sonner";
import type { MailSimple } from "@/demo/material-mail/state/mail";

export function MailCard({ mail }: { mail: MailSimple }) {
  return (
    <li>
      <button
        type="button"
        onClick={() =>
          toast("Mail detail is mocked in this demo", { duration: 1500 })
        }
        className="flex w-full items-start gap-3 px-4 py-3 text-left active:bg-neutral-100/70"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white ${mail.senderColor}`}
        >
          {mail.senderInitial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span
              className={`truncate text-[15px] ${
                mail.unread
                  ? "font-semibold text-neutral-900"
                  : "font-medium text-neutral-700"
              }`}
            >
              {mail.sender}
            </span>
            <span className="shrink-0 text-[12px] text-neutral-500">
              {mail.timeLabel}
            </span>
          </div>
          <div
            className={`truncate text-[14px] ${
              mail.unread ? "font-medium text-neutral-900" : "text-neutral-700"
            }`}
          >
            {mail.subject}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <p className="line-clamp-1 flex-1 text-[13px] text-neutral-500">
              {mail.preview}
            </p>
            {mail.hasAttachment && (
              <Paperclip
                size={14}
                strokeWidth={2}
                className="shrink-0 text-neutral-400"
              />
            )}
          </div>
        </div>
        <Star
          size={18}
          strokeWidth={1.75}
          fill={mail.starred ? "#F5B100" : "none"}
          className={`mt-1 shrink-0 ${
            mail.starred ? "text-amber-500" : "text-neutral-300"
          }`}
        />
      </button>
    </li>
  );
}
