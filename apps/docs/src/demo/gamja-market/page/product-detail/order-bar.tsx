"use client";

import { useState } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { useOrder } from "@/demo/gamja-market/state/order";
import type { ProductDetail } from "@/demo/gamja-market/state/product";

export function OrderBar({ product }: { product: ProductDetail }) {
  const order = useOrder((state) => ({ actions: state.actions }));
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const total = product.price * quantity;

  const handleOrder = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await order.actions.create({
        productId: product.id,
        productName: product.name,
        thumbnail: product.thumbnail,
        unitPrice: product.price,
        pickupDate: product.pickupDate,
        pickupPlace: product.pickupPlace,
        quantity,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 pb-5 pt-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] text-gray-600">수량</span>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-l-md border border-gray-300 bg-white disabled:cursor-not-allowed"
            disabled={quantity <= 1}
            aria-label="감소"
          >
            <Minus
              className={`h-4 w-4 ${quantity <= 1 ? "text-gray-300" : "text-gray-700"}`}
            />
          </button>
          <div className="flex h-9 w-9 items-center justify-center border-y border-gray-300 bg-white">
            <span className="text-[13px] font-semibold text-gray-900">
              {quantity}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-r-md border border-gray-300 bg-white"
            aria-label="추가"
          >
            <Plus className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={handleOrder}
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2db400] py-4 text-[15px] font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#25a000] disabled:opacity-70"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {total.toLocaleString()}원 주문하기
      </button>
    </div>
  );
}
