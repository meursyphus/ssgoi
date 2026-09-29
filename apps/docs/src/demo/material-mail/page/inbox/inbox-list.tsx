"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMail } from "@/demo/material-mail/state/mail";
import { MailCard } from "../shared/mail-card";
import { EmptyMailbox } from "./empty-mailbox";
import { MAILBOX_LABELS } from "./mailbox-labels";

export function InboxList() {
  const mail = useMail((s) => ({ mails: s.mails, mailbox: s.mailbox }));

  if (mail.mails.isLoading) {
    return (
      <div className="flex flex-col">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3" aria-hidden>
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

  // Switching mailboxes in the drawer fades through to the new list. The
  // first render (including a drill back from a conversation) does not fade.
  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={mail.mailbox}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.09 } }}
      >
        <p className="px-4 pt-1 pb-1 text-[13px] font-medium text-neutral-500">
          {MAILBOX_LABELS[mail.mailbox]}
        </p>
        {mail.mails.data.length === 0 ? (
          <EmptyMailbox label={MAILBOX_LABELS[mail.mailbox]} />
        ) : (
          <ul className="flex flex-col">
            {mail.mails.data.map((m) => (
              <MailCard key={m.id} item={m} />
            ))}
          </ul>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
