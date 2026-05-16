"use client";

import { Loader2 } from "lucide-react";
import { useProduct } from "@/demo/gamja-market/state/product";
import { ProductCard } from "./product-card";

const FALLBACK_PICKUP_DATE = "픽업 예정일";
const FALLBACK_PICKUP_PLACE = "올림픽파크포레온점 1층 픽업존";

function pickupDateFromLabel(label: string): string {
  const match = label.match(/\d{4}\.\d{2}\.\d{2}/);
  return match ? match[0] : FALLBACK_PICKUP_DATE;
}

export function ProductList() {
  const product = useProduct((state) => ({
    products: state.products,
    actions: state.actions,
  }));

  if (product.products.isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100 bg-white">
      {product.products.data.map((p) => (
        <li key={p.id}>
          <ProductCard
            product={p}
            pickupDate={pickupDateFromLabel(p.pickupLabel)}
            pickupPlace={FALLBACK_PICKUP_PLACE}
          />
        </li>
      ))}
    </ul>
  );
}
