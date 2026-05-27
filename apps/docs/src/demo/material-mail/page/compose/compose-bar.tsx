"use client";

import { Link } from "@/lib/link";
import { X, Paperclip, Send, MoreVertical } from "lucide-react";
import { toast } from "sonner";

export function ComposeBar() {
  return (
    <div className="flex items-center gap-1 px-2 py-2.5 border-b border-neutral-200/80 bg-white">
      <Link
        href="/demo/material-mail"
        scroll={false}
        className="rounded-full p-2 text-neutral-700 active:bg-neutral-100"
        aria-label="Close"
      >
        <X size={22} strokeWidth={2.25} />
      </Link>
      <div className="flex-1 px-2 text-[16px] font-medium text-neutral-900">
        Compose
      </div>
      <button
        type="button"
        onClick={() => toast("Attachment picker is mocked")}
        className="rounded-full p-2 text-neutral-700 active:bg-neutral-100"
        aria-label="Attach"
      >
        <Paperclip size={20} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        onClick={() => toast("Send is mocked in this demo")}
        className="rounded-full p-2 text-indigo-600 active:bg-indigo-50"
        aria-label="Send"
      >
        <Send size={20} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        className="rounded-full p-2 text-neutral-700 active:bg-neutral-100"
        aria-label="More options"
      >
        <MoreVertical size={20} strokeWidth={2.25} />
      </button>
    </div>
  );
}
