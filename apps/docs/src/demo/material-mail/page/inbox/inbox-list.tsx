"use client";

import { useMail } from "@/demo/material-mail/state/mail";
import { MailCard } from "./mail-card";

export function InboxList() {
  const mail = useMail((s) => ({ mails: s.mails }));

  if (mail.mails.isLoading) {
    return (
      <div className="flex flex-col">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-4 py-3"
            aria-hidden
          >
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-neutral-200" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-200" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {mail.mails.data.map((m) => (
        <MailCard key={m.id} mail={m} />
      ))}
    </ul>
  );
}
