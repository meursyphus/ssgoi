import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { OrderSimple } from "@/demo/gamja-market/state/order";

const STATUS_COLOR: Record<OrderSimple["status"], string> = {
  pending: "text-amber-600",
  ready: "text-[#2db400]",
  picked_up: "text-gray-500",
};

export function OrderRow({ order }: { order: OrderSimple }) {
  return (
    <Link
      href={`/demo/gamja-market/orders/${order.id}`}
      className="block bg-white px-4 py-4 active:bg-black/[0.02]"
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-[13px] font-semibold ${STATUS_COLOR[order.status]}`}
        >
          {order.statusLabel}
        </span>
        <span className="text-[11px] text-gray-400">
          {order.orderedAt} 주문
        </span>
      </div>
      <div className="mt-2.5 flex gap-3">
        <div className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[6px] bg-gray-100">
          <img
            src={order.thumbnail}
            alt={order.productName}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="line-clamp-2 text-[14px] font-medium text-gray-800">
            {order.productName}
          </p>
          <p className="mt-1 text-[12px] text-gray-500">
            {order.quantity}개 · {order.totalPrice.toLocaleString()}원
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">
            {order.pickupLabel}
          </p>
        </div>
        <div className="flex items-center text-gray-300">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
