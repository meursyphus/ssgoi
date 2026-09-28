"use client";

import { Input } from "@/lib/components/ui/input";
import { Textarea } from "@/lib/components/ui/textarea";
import type { Formats } from "./compose-toolbar";

export type ComposeFields = { to: string; subject: string; body: string };

const FIELD =
  "h-12 border-0 px-0 text-[15px] text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:ring-0";

export function ComposeForm({
  fields,
  onChange,
  formats,
  compact = false,
}: {
  fields: ComposeFields;
  onChange: (next: ComposeFields) => void;
  formats: Formats;
  /** Replies leave room for the quoted original below. */
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <FieldRow label="From">
        <div className="flex items-center gap-2 py-3 text-[15px] text-neutral-700">
          <span>me@example.com</span>
        </div>
      </FieldRow>
      <FieldRow label="To">
        <Input
          value={fields.to}
          onChange={(e) => onChange({ ...fields, to: e.target.value })}
          placeholder="Recipients"
          className={FIELD}
        />
      </FieldRow>
      <FieldRow label="Subject">
        <Input
          value={fields.subject}
          onChange={(e) => onChange({ ...fields, subject: e.target.value })}
          placeholder="Subject"
          className={FIELD}
        />
      </FieldRow>
      <div className="px-5 py-3">
        <Textarea
          value={fields.body}
          onChange={(e) => onChange({ ...fields, body: e.target.value })}
          placeholder="Compose email"
          rows={compact ? 5 : 12}
          className={`${compact ? "min-h-[140px]" : "min-h-[280px]"} resize-none border-0 px-0 text-[15px] leading-relaxed text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:ring-0 ${
            formats.bold ? "font-semibold" : ""
          } ${formats.italic ? "italic" : ""} ${formats.underline ? "underline" : ""}`}
        />
      </div>
    </div>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 border-b border-neutral-200/70 px-5">
      <span className="w-16 shrink-0 text-[13px] tracking-wide text-neutral-500 uppercase">
        {label}
      </span>
      <div className="flex-1">{children}</div>
    </label>
  );
}
