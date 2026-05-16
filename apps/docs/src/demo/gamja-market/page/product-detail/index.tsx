"use client";

import { SsgoiTransition } from "@ssgoi/react";
import {
  useProduct,
  type ProductDetail,
} from "@/demo/gamja-market/state/product";
import { DetailHeader } from "./detail-header";
import { ProductGallery } from "./product-gallery";
import { ProductInfo } from "./product-info";
import { PickupInfo } from "./pickup-info";
import { Description } from "./description";
import { OrderBar } from "./order-bar";

export default function ProductDetailPage({
  initialData,
}: {
  initialData: ProductDetail;
}) {
  const product = useProduct((state) => ({ actions: state.actions }));
  product.actions.init(initialData);

  return (
    <SsgoiTransition
      id={`/demo/gamja-market/products/${initialData.id}`}
      className="flex min-h-full flex-col bg-[#FAF8F6]"
    >
      <DetailHeader />
      <ProductGallery images={initialData.images} alt={initialData.name} />
      <ProductInfo product={initialData} />
      <PickupInfo product={initialData} />
      <Description product={initialData} />
      <div className="flex-1" />
      <OrderBar product={initialData} />
    </SsgoiTransition>
  );
}
