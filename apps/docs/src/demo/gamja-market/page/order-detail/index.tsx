"use client";

import { useOrder, type OrderDetail } from "@/demo/gamja-market/state/order";
import { OrderDetailHeader } from "./detail-header";
import { StatusBanner } from "./status-banner";
import { ProductSummary } from "./product-summary";
import { PickupInfo } from "./pickup-info";
import { PaymentSummary } from "./payment-summary";
import { ReviewCta } from "./review-cta";
import { OrderNotFound } from "./order-not-found";
export default function OrderDetailPage({
  id,
  initialData,
}: {
  id: string;
  /** null when the order was placed in this session (server only has the seed). */
  initialData: OrderDetail | null;
}) {
  const order = useOrder((state) => ({
    sessionOrders: state.sessionOrders,
    actions: state.actions,
  }));
  if (initialData) order.actions.init(initialData);
  // This session's copy is newer: a review written here, or a new order.
  const data = order.sessionOrders[id] ?? initialData;
  if (!data) return <OrderNotFound />;
  return (
    <div className="flex min-h-full flex-col bg-[#FAF8F6]">
      <OrderDetailHeader />
      <StatusBanner order={data} />
      <ProductSummary order={data} />
      <PickupInfo order={data} />
      <PaymentSummary order={data} />
      <div className="flex-1" />
      <ReviewCta order={data} />
    </div>
  );
}
