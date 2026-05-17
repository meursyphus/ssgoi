"use client";

import { useEffect } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { useProduct } from "@/demo/gamja-market/state/product";
import { useOrder } from "@/demo/gamja-market/state/order";
import { HomeHeader } from "./header";
import { SectionTitle } from "./section-title";
import { ProductList } from "./product-list";
import { FloatingBottom } from "./floating-bottom";

export default function HomePage() {
  const product = useProduct((state) => ({ actions: state.actions }));
  const order = useOrder((state) => ({ actions: state.actions }));

  useEffect(() => {
    product.actions.loadProducts();
    order.actions.loadOrders();
  }, [product.actions, order.actions]);

  return (
    <SsgoiTransition
      id="/demo/gamja-market"
      className="flex min-h-full flex-col bg-[#FAF8F6]"
    >
      <HomeHeader />
      <SectionTitle />
      <div className="flex-1">
        <ProductList />
      </div>
      <FloatingBottom />
      <div className="h-6" />
    </SsgoiTransition>
  );
}
