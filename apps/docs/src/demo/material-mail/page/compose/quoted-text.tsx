"use client";

import type { ReplyDraft } from "@/demo/material-mail/state/mail";

/** The quoted original under a reply, or the header block of a forward. */
export function QuotedText({ draft }: { draft: ReplyDraft }) {
  const forward = draft.mode === "forward";
  return (
    <div className="px-5 pb-6 text-[13px] leading-relaxed text-neutral-500">
      {draft.quoteHeader.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <div
        className={
          forward
            ? "mt-3 space-y-2"
            : "mt-2 space-y-2 border-l-2 border-neutral-200 pl-3"
        }
      >
        {draft.quote.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
