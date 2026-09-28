"use client";

import { useState } from "react";
import type { ReplyDraft } from "@/demo/material-mail/state/mail";
import { ComposeBar } from "./compose-bar";
import { ComposeForm, type ComposeFields } from "./compose-form";
import { ComposeToolbar, type Formats } from "./compose-toolbar";
import { QuotedText } from "./quoted-text";

const BASE = "/demo/material-mail";

const TITLES: Record<ReplyDraft["mode"], string> = {
  reply: "Reply",
  all: "Reply all",
  forward: "Forward",
};

export default function ComposePage({
  draft = null,
}: {
  draft?: ReplyDraft | null;
}) {
  const [fields, setFields] = useState<ComposeFields>({
    to: draft?.to ?? "",
    subject: draft?.subject ?? "",
    body: "",
  });
  const [formats, setFormats] = useState<Formats>({
    bold: false,
    italic: false,
    underline: false,
  });
  // Close and Send return to the screen that raised the sheet. With nothing
  // of the demo behind it (direct entry, a showcase clip), replies close onto
  // their conversation and the FAB's compose onto the inbox; the sheet rule
  // plays that replace backward too.
  const returnTo = draft ? `${BASE}/m/${draft.id}` : BASE;

  return (
    <div className="relative flex min-h-full flex-col bg-white">
      <ComposeBar
        title={draft ? TITLES[draft.mode] : "Compose"}
        returnTo={returnTo}
      />
      <div className="flex-1">
        <ComposeForm
          fields={fields}
          onChange={setFields}
          formats={formats}
          compact={!!draft}
        />
        {draft && <QuotedText draft={draft} />}
      </div>
      <ComposeToolbar
        formats={formats}
        onToggle={(key) => setFormats((f) => ({ ...f, [key]: !f[key] }))}
      />
    </div>
  );
}
