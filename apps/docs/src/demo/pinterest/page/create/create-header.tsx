"use client";

import { X } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";

export function CreateHeader() {
  return (
    <div className="grid grid-cols-[40px_1fr_40px] items-center px-2 pt-4 pb-2">
      <DemoBackLink
        fallback="/demo/pinterest"
        aria-label="닫기"
        className="grid h-10 w-10 place-items-center rounded-full text-black active:bg-neutral-100"
      >
        <X className="h-6 w-6" strokeWidth={2.4} />
      </DemoBackLink>
      <h1 className="text-center text-[17px] font-bold text-black">
        지금 만들기 시작하기
      </h1>
    </div>
  );
}
