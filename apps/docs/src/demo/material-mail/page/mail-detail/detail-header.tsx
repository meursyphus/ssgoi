"use client";

import { ArrowLeft, Archive, Trash2, Mail } from "lucide-react";
import { useMail } from "@/demo/material-mail/state/mail";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { useDemoBack } from "@/lib/hooks";

const BASE = "/demo/material-mail";

export function DetailHeader({ id }: { id: string }) {
  const mail = useMail((s) => ({ actions: s.actions }));
  // The list the conversation was opened from (inbox or search), else the
  // inbox: the drill rule plays the replace backward.
  const leave = useDemoBack(BASE);

  // Gmail leaves the conversation after each of these and confirms with a
  // snackbar; the list it returns to already reflects the change.
  const thenLeave = (run: () => Promise<void>) => async () => {
    await run();
    leave();
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-1 bg-white/95 px-2 backdrop-blur">
      <DemoBackLink
        fallback={BASE}
        className="rounded-full p-2.5 text-neutral-700 active:bg-neutral-100"
        aria-label="Back"
      >
        <ArrowLeft size={22} strokeWidth={2.25} />
      </DemoBackLink>
      <div className="flex-1" />
      <IconButton
        label="Archive"
        onClick={thenLeave(() => mail.actions.archive(id))}
      >
        <Archive size={20} strokeWidth={2} />
      </IconButton>
      <IconButton
        label="Delete"
        onClick={thenLeave(() => mail.actions.trash(id))}
      >
        <Trash2 size={20} strokeWidth={2} />
      </IconButton>
      <IconButton
        label="Mark unread"
        onClick={thenLeave(() => mail.actions.markUnread(id))}
      >
        <Mail size={20} strokeWidth={2} />
      </IconButton>
    </header>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full p-2.5 text-neutral-700 active:bg-neutral-100"
      aria-label={label}
    >
      {children}
    </button>
  );
}
