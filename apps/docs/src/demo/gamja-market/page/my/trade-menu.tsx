"use client";

import { ChevronRight, PenLine, Receipt, Store } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@/lib/link";
import { useOrder } from "@/demo/gamja-market/state/order";
import { BASE, routes } from "@/demo/gamja-market/page/shared/routes";

function MenuRow({
  href,
  icon,
  label,
  trailing,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  trailing?: ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className="flex items-center gap-3 px-4 py-3.5 active:bg-black/[0.03]"
    >
      <span className="text-gray-700">{icon}</span>
      <span className="flex-1 text-[15px] text-gray-900">{label}</span>
      {trailing}
      <ChevronRight className="h-4 w-4 text-gray-300" />
    </Link>
  );
}

export function TradeMenu() {
  const order = useOrder((state) => ({ summary: state.summary }));
  const summary = order.summary.data;
  const reviewHref = summary.reviewableOrderId
    ? routes.review(summary.reviewableOrderId)
    : routes.orders;

  return (
    <section className="mt-2 bg-white py-2">
      <h2 className="px-4 pb-1 pt-3 text-[13px] font-semibold text-gray-900">
        나의 거래
      </h2>
      <MenuRow
        href={routes.orders}
        icon={<Receipt className="h-5 w-5" />}
        label="구매내역"
        trailing={
          summary.totalCount > 0 ? (
            <span className="text-[13px] text-gray-500">
              {summary.totalCount}건
            </span>
          ) : null
        }
      />
      <MenuRow
        href={reviewHref}
        icon={<PenLine className="h-5 w-5" />}
        label="리뷰 쓰기"
        trailing={
          summary.reviewableCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2db400] px-1.5 text-[11px] font-bold text-white">
              {summary.reviewableCount}
            </span>
          ) : null
        }
      />
      <MenuRow
        href={`${BASE}/near`}
        icon={<Store className="h-5 w-5" />}
        label="단골 픽업 매장"
        trailing={
          <span className="text-[13px] text-gray-500">올림픽파크포레온점</span>
        }
      />
    </section>
  );
}
