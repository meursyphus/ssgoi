"use client";

import { useRouter } from "next/navigation";
import { X, Gift, Wallet, MoreHorizontal } from "lucide-react";

export function ProfileHeader() {
  const router = useRouter();
  const close = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/demo/kakao-talk");
    }
  };
  return (
    <header className="absolute left-0 right-0 top-0 z-10 flex h-12 items-center justify-between px-3 pt-1">
      <IconButton label="닫기" onClick={close}>
        <X className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </IconButton>
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
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/15 text-white/90 backdrop-blur-sm active:bg-black/25"
    >
      {children}
    </button>
  );
}
