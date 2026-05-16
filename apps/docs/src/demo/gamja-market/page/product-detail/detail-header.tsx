"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Share2 } from "lucide-react";

export function DetailHeader() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 flex h-12 items-center justify-between bg-[#FAF8F6]/95 px-2 backdrop-blur">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="뒤로"
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-black/5"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="공유"
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-black/5"
      >
        <Share2 className="h-[18px] w-[18px]" />
      </button>
    </header>
  );
}
