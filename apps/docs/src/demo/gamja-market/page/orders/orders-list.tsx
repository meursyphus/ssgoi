"use client";

import { Loader2 } from "lucide-react";
import { useOrder } from "@/demo/gamja-market/state/order";
import { OrderRow } from "./order-row";

export function OrdersList() {
  const order = useOrder((state) => ({
    orders: state.orders,
    actions: state.actions,
  }));

  if (order.orders.isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (order.orders.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-[13px]">아직 주문 내역이 없어요</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2 pb-8">
      {order.orders.data.map((o) => (
        <li key={o.id}>
          <OrderRow order={o} />
        </li>
      ))}
    </ul>
  );
}
