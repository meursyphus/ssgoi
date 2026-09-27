"use client";

import { X } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { routes } from "@/demo/gamja-market/page/shared/routes";

export function ReviewHeader({ orderId }: { orderId: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-[#FAF8F6] px-2 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <DemoBackLink
        fallback={routes.order(orderId)}
        aria-label="닫기"
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-black/5"
      >
        <X className="h-5 w-5" />
      </DemoBackLink>
      <h1 className="text-[16px] font-bold text-gray-900">리뷰 쓰기</h1>
      <div className="w-9" />
    </header>
  );
}
