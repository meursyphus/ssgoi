"use client";

import { SsgoiTransition } from "@ssgoi/react";
import { useOrder, type OrderDetail } from "@/demo/gamja-market/state/order";
import { OrderDetailHeader } from "./detail-header";
import { StatusBanner } from "./status-banner";
import { ProductSummary } from "./product-summary";
import { PickupInfo } from "./pickup-info";
import { PaymentSummary } from "./payment-summary";
import { ReviewCta } from "./review-cta";

export default function OrderDetailPage({
  initialData,
}: {
  initialData: OrderDetail;
}) {
  const order = useOrder((state) => ({
    current: state.currentOrder,
    actions: state.actions,
  }));
  order.actions.init(initialData);

  const data = order.current ?? initialData;

  return (
    <SsgoiTransition
      id={`/demo/gamja-market/orders/${initialData.id}`}
      className="flex min-h-full flex-col bg-[#FAF8F6]"
    >
      <OrderDetailHeader />
      <StatusBanner order={data} />
      <ProductSummary order={data} />
      <PickupInfo order={data} />
      <PaymentSummary order={data} />
      <div className="flex-1" />
      <ReviewCta order={data} />
    </SsgoiTransition>
  );
}
