"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export function ReviewHeader() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-[#FAF8F6] px-2 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="닫기"
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-black/5"
      >
        <X className="h-5 w-5" />
      </button>
      <h1 className="text-[16px] font-bold text-gray-900">리뷰 쓰기</h1>
      <div className="w-9" />
    </header>
  );
}
