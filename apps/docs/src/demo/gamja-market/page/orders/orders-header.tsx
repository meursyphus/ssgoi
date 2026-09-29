"use client";

import { ChevronLeft } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { BASE } from "@/demo/gamja-market/page/shared/routes";

export function OrdersHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center bg-[#FAF8F6] px-2 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <DemoBackLink
        fallback={BASE}
        aria-label="뒤로"
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-black/5"
      >
        <ChevronLeft className="h-5 w-5" />
      </DemoBackLink>
      <h1 className="ml-1 text-[16px] font-bold text-gray-900">주문 내역</h1>
    </header>
  );
}
