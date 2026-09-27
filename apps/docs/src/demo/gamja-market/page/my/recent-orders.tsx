"use client";

import { Loader2 } from "lucide-react";
import { Link } from "@/lib/link";
import { useOrder } from "@/demo/gamja-market/state/order";
import { routes } from "@/demo/gamja-market/page/shared/routes";
import { OrderRow } from "../orders/order-row";

export function RecentOrders() {
  const order = useOrder((state) => ({ summary: state.summary }));

  return (
    <section className="mt-2">
      <div className="flex items-center justify-between bg-white px-4 pb-1 pt-4">
        <h2 className="text-[13px] font-semibold text-gray-900">최근 주문</h2>
        <Link
          href={routes.orders}
          scroll={false}
          className="text-[12px] font-medium text-gray-500 active:text-gray-800"
        >
          전체보기
        </Link>
      </div>
      {order.summary.isSuccess ? (
        <ul className="flex flex-col divide-y divide-gray-100">
          {order.summary.data.recent.map((o) => (
            <li key={o.id}>
              <OrderRow order={o} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center bg-white py-10 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
    </section>
  );
}
