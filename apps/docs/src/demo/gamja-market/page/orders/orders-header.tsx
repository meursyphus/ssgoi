"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function OrdersHeader() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center bg-[#FAF8F6] px-2 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="뒤로"
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-black/5"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <h1 className="ml-1 text-[16px] font-bold text-gray-900">주문 내역</h1>
    </header>
  );
}
