"use client";

import { X } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { BASE } from "../shared/routes";

export function ComposeBar({
  canPublish,
  onPublish,
}: {
  canPublish: boolean;
  onPublish: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-1 border-b border-neutral-200/80 bg-white px-2 py-2.5">
      {/* Only the feed opens the composer. Closing it leaves the `on` scope,
          so the sheet drops back whether this goes back or replaces. */}
      <DemoBackLink
        fallback={BASE}
        className="rounded-full p-2 text-neutral-700 active:bg-neutral-100"
        aria-label="Close"
      >
        <X size={22} strokeWidth={2.25} />
      </DemoBackLink>
      <div className="flex-1 px-1 text-[16px] font-semibold text-neutral-900">
        New story
      </div>
      <button
        type="button"
        onClick={onPublish}
        className={`rounded-full px-4 py-2 text-[14px] font-semibold text-white transition-colors ${
          canPublish
            ? "bg-[#FF5A5F] active:bg-[#e84e53]"
            : "bg-[#FF5A5F]/45 active:bg-[#FF5A5F]/60"
        }`}
      >
        Publish
      </button>
    </div>
  );
}
