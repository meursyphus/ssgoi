"use client";

import { Link } from "@/lib/link";
import { X } from "lucide-react";
import { toast } from "sonner";

export function ComposeBar() {
  return (
    <div className="flex items-center gap-1 border-b border-neutral-200/80 bg-white px-2 py-2.5">
      <Link
        href="/demo/voyage"
        scroll={false}
        className="rounded-full p-2 text-neutral-700 active:bg-neutral-100"
        aria-label="Close"
      >
        <X size={22} strokeWidth={2.25} />
      </Link>
      <div className="flex-1 px-1 text-[16px] font-semibold text-neutral-900">
        New story
      </div>
      <button
        type="button"
        onClick={() => toast("Publishing is mocked in this demo")}
        className="rounded-full bg-[#FF5A5F] px-4 py-2 text-[14px] font-semibold text-white active:bg-[#e84e53]"
      >
        Publish
      </button>
    </div>
  );
}
