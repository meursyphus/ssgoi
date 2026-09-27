"use client";

import { toast } from "sonner";
import { FileText } from "lucide-react";
import type { MailDetail } from "@/demo/material-mail/state/mail";

export function MessageBody({ mail }: { mail: MailDetail }) {
  return (
    <div className="px-4 pt-5">
      <div className="space-y-4 text-[15px] leading-relaxed text-neutral-800">
        {mail.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      {mail.attachment && (
        <button
          type="button"
          onClick={() => toast("File preview is mocked in this demo")}
          className="mt-6 flex w-full items-center gap-3 rounded-xl border border-neutral-200 p-3 text-left active:bg-neutral-50"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <FileText size={20} strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-medium text-neutral-900">
              {mail.attachment.name}
            </span>
            <span className="block text-[12px] text-neutral-500">
              {mail.attachment.size}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
