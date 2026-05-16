import type { ProductDetail } from "@/demo/gamja-market/state/product";

export function ProductInfo({ product }: { product: ProductDetail }) {
  return (
    <section className="bg-white px-4 py-5">
      <h1 className="text-[18px] font-semibold leading-snug text-gray-900">
        {product.name}
      </h1>
      <p className="mt-1.5 text-[12px] text-gray-400">
        누적 판매 {product.soldCount}
      </p>
      <p className="mt-3 text-[24px] font-bold text-gray-900">
        {product.price.toLocaleString()}원
      </p>
    </section>
  );
}
