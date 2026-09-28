"use client";

import { X, Paperclip, Send, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { useDemoBack } from "@/lib/hooks";

export function ComposeBar({
  title,
  returnTo,
}: {
  title: string;
  returnTo: string;
}) {
  const close = useDemoBack(returnTo);

  return (
    <div className="sticky top-0 z-10 flex items-center gap-1 border-b border-neutral-200/80 bg-white px-2 py-2.5">
      <DemoBackLink
        fallback={returnTo}
        className="rounded-full p-2 text-neutral-700 active:bg-neutral-100"
        aria-label="Close"
      >
        <X size={22} strokeWidth={2.25} />
      </DemoBackLink>
      <div className="flex-1 px-2 text-[16px] font-medium text-neutral-900">
        {title}
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
        onClick={() => {
          close();
          toast("Message sent", { duration: 2500 });
        }}
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
