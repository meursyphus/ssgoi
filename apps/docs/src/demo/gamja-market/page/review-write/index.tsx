"use client";

import { useOrder, type OrderDetail } from "@/demo/gamja-market/state/order";
import { ReviewHeader } from "./review-header";
import { ProductCard } from "./product-card";
import { ReviewForm } from "./review-form";
export default function ReviewWritePage({
  initialData,
}: {
  initialData: OrderDetail;
}) {
  const order = useOrder((state) => ({
    actions: state.actions,
  }));
  order.actions.init(initialData);
  return (
    <div className="flex min-h-full flex-col bg-[#FAF8F6]">
      <ReviewHeader />
      <ProductCard order={initialData} />
      <ReviewForm order={initialData} />
    </div>
  );
}
