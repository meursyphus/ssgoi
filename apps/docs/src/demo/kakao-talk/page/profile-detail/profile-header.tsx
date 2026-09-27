"use client";

import { X, Gift, Wallet, MoreHorizontal } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";

const ICON_BUTTON =
  "flex h-9 w-9 items-center justify-center rounded-full bg-black/15 text-white/90 backdrop-blur-sm active:bg-black/25";

export function ProfileHeader() {
  return (
    <header className="absolute left-0 right-0 top-0 z-10 flex h-12 items-center justify-between px-3 pt-1">
      <DemoBackLink
        fallback="/demo/kakao-talk"
        aria-label="닫기"
        className={ICON_BUTTON}
      >
        <X className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </DemoBackLink>
      <div className="flex items-center gap-1.5">
        <IconButton label="선물">
          <Gift className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </IconButton>
        <IconButton label="송금">
          <Wallet className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </IconButton>
        <IconButton label="더보기">
          <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </IconButton>
      </div>
    </header>
  );
}

function IconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" aria-label={label} className={ICON_BUTTON}>
      {children}
    </button>
  );
}
