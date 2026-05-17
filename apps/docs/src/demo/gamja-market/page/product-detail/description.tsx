import type { ProductDetail } from "@/demo/gamja-market/state/product";

export function Description({ product }: { product: ProductDetail }) {
  return (
    <section className="mt-2 bg-white px-4 py-5">
      <h2 className="text-[13px] font-semibold text-gray-900">상품 설명</h2>
      <p className="mt-2.5 whitespace-pre-line text-[13px] leading-relaxed text-gray-700">
        {product.description}
      </p>
    </section>
  );
}
