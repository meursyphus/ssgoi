"use client";

import type { ProductSimple } from "@/demo/gamja-market/state/product";
import { TabHeader } from "@/demo/gamja-market/page/shared/tab-header";
import { StoreMap } from "./store-map";
import { StoreCard } from "./store-card";
import { StoreProducts } from "./store-products";

export default function NearPage({ products }: { products: ProductSimple[] }) {
  return (
    <div className="flex min-h-full flex-col bg-[#FAF8F6] pb-6">
      <TabHeader title="내근처">
        <span className="text-[13px] font-medium text-gray-500">둔촌동</span>
      </TabHeader>
      <StoreMap />
      <StoreCard productCount={products.length} />
      <StoreProducts products={products} />
    </div>
  );
}
