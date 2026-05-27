"use client";

import { useEffect } from "react";
import { useOrder } from "@/demo/gamja-market/state/order";
import { OrdersHeader } from "./orders-header";
import { OrdersList } from "./orders-list";
export default function OrdersPage() {
  const order = useOrder((state) => ({
    actions: state.actions,
  }));
  useEffect(() => {
    order.actions.loadOrders();
  }, [order.actions]);
  return (
    <div
      data-ssgoi-transition="/demo/gamja-market/orders"
      className="flex min-h-full flex-col bg-[#FAF8F6]"
    >
      <OrdersHeader />
      <div className="flex-1">
        <OrdersList />
      </div>
    </div>
  );
}
