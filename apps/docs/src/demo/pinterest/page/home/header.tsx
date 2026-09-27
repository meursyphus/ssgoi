"use client";

import { Plus, MessageCircle } from "lucide-react";
import { Link } from "@/lib/link";
import { usePin } from "@/demo/pinterest/state/pin";
import { PinterestGlyph } from "../shared/pinterest-glyph";

const BASE = "/demo/pinterest";

export function HomeHeader() {
  const pin = usePin((state) => ({
    hasUnreadUpdates: state.hasUnreadUpdates,
  }));
  return (
    <div className="sticky top-0 bg-white/95 backdrop-blur z-9999">
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <PinterestWordmark />
        <div className="flex-1" />
        <Link
          href={`${BASE}/create`}
          scroll={false}
          aria-label="추가"
          className="grid h-9 w-9 place-items-center rounded-full text-black active:bg-neutral-100"
        >
          <Plus className="h-7 w-7" strokeWidth={2.6} />
        </Link>
        <Link
          href={`${BASE}/inbox`}
          scroll={false}
          aria-label="받은 편지함"
          className="relative grid h-9 w-9 place-items-center rounded-full text-black active:bg-neutral-100"
        >
          <MessageCircle className="h-6 w-6" strokeWidth={2.4} />
          {pin.hasUnreadUpdates && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </Link>
      </div>
    </div>
  );
}

function PinterestWordmark() {
  return (
    <div className="flex items-center gap-1">
      <PinterestGlyph size={28} className="text-[#E60023]" />
      <span className="text-[24px] font-bold tracking-tight text-[#E60023]">
        Pinterest
      </span>
    </div>
  );
}
