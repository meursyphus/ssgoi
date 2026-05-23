"use client";

import { useState } from "react";
import { Input } from "@/lib/components/ui/input";
import { Textarea } from "@/lib/components/ui/textarea";

export function ComposeForm() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="flex flex-col">
      <FieldRow label="From">
        <div className="flex items-center gap-2 py-3 text-[15px] text-neutral-700">
          <span>me@example.com</span>
        </div>
      </FieldRow>
      <FieldRow label="To">
        <Input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Recipients"
          className="h-12 border-0 px-0 text-[15px] shadow-none focus-visible:ring-0"
        />
      </FieldRow>
      <FieldRow label="Subject">
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="h-12 border-0 px-0 text-[15px] shadow-none focus-visible:ring-0"
        />
      </FieldRow>
      <div className="px-5 py-3">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Compose email"
          rows={12}
          className="min-h-[280px] resize-none border-0 px-0 text-[15px] leading-relaxed shadow-none focus-visible:ring-0"
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
      <span className="w-16 shrink-0 text-[13px] uppercase tracking-wide text-neutral-500">
        {label}
      </span>
      <div className="flex-1">{children}</div>
    </label>
  );
}
