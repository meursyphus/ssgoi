"use client";

import Link from "next/link";
import { PenLine, CheckCircle2 } from "lucide-react";
import type { OrderDetail } from "@/demo/gamja-market/state/order";

export function ReviewCta({ order }: { order: OrderDetail }) {
  if (order.status !== "picked_up") return null;

  if (order.reviewWritten) {
    return (
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 pb-5 pt-3">
        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-4 text-[14px] font-medium text-gray-500">
          <CheckCircle2 className="h-4 w-4" />
          리뷰를 등록했어요
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 pb-5 pt-3">
      <Link
        href={`/demo/gamja-market/review/${order.id}`}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2db400] py-4 text-[15px] font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#25a000]"
      >
        <PenLine className="h-4 w-4" />
        리뷰 쓰기
      </Link>
    </div>
  );
}
