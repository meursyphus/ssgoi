"use client";

import { toast } from "sonner";
import { ChevronDown, Heart, SquarePlus } from "lucide-react";
import { Link } from "@/lib/link";

export function HomeHeader() {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between bg-white px-3 pb-1 pt-2">
      <Link
        href="/demo/instagram/create"
        scroll={false}
        aria-label="새 게시물"
        className="grid h-10 w-10 place-items-center transition-transform active:scale-90"
      >
        <SquarePlus className="h-[26px] w-[26px]" strokeWidth={1.6} />
      </Link>
      <div className="flex items-center gap-1">
        <span
          className="text-[28px] leading-none"
          style={{
            fontFamily:
              '"Snell Roundhand", "Segoe Script", "Brush Script MT", cursive',
            fontWeight: 700,
          }}
        >
          Instagram
        </span>
        <ChevronDown className="mt-1 h-4 w-4" strokeWidth={2.4} />
      </div>
      <button
        type="button"
        aria-label="알림"
        onClick={() => toast("새로운 활동이 없어요", { duration: 1500 })}
        className="grid h-10 w-10 place-items-center"
      >
        <Heart className="h-[26px] w-[26px]" strokeWidth={1.6} />
      </button>
    </div>
  );
}
