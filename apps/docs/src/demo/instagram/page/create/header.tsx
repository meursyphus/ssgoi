"use client";

import { toast } from "sonner";
import { X } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import type { CreateMode } from "./mode-switch";

const TITLE: Record<CreateMode, string> = {
  post: "새 게시물",
  story: "스토리에 추가",
  reel: "새 릴스",
};

export function CreateHeader({ mode }: { mode: CreateMode }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between bg-black px-2 py-2.5">
      <DemoBackLink
        fallback="/demo/instagram/profile/deaseungseung94"
        aria-label="닫기"
        className="grid h-10 w-10 place-items-center"
      >
        <X className="h-7 w-7" strokeWidth={1.8} />
      </DemoBackLink>
      <span className="text-[16px] font-semibold">{TITLE[mode]}</span>
      <button
        type="button"
        onClick={() =>
          toast("데모에서는 실제로 게시되지 않아요", { duration: 1500 })
        }
        className="px-3 text-[15px] font-semibold text-sky-500 active:text-sky-300"
      >
        다음
      </button>
    </div>
  );
}
