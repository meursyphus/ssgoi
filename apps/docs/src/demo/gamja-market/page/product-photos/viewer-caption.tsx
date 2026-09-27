import type { ProductDetail } from "@/demo/gamja-market/state/product";

export function ViewerCaption({ product }: { product: ProductDetail }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-8 pt-12">
      <p className="line-clamp-1 text-[14px] font-medium text-white">
        {product.name}
      </p>
      <p className="mt-1 text-[13px] text-white/70">
        {product.price.toLocaleString()}원 · 누적 판매 {product.soldCount}
      </p>
    </div>
  );
}
