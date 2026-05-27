"use client";

import { Link } from "@/lib/link";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/demo/gamja-market/state/cart";
import type { ProductSimple } from "@/demo/gamja-market/state/product";

type Props = {
  product: ProductSimple;
  pickupDate: string;
  pickupPlace: string;
};

export function ProductCard({ product, pickupDate, pickupPlace }: Props) {
  const cart = useCart((state) => ({
    items: state.items,
    actions: state.actions,
  }));

  const inCart = cart.items.find((i) => i.productId === product.id);
  const quantity = inCart?.quantity ?? 0;

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    cart.actions.subtract(product.id);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    cart.actions.add({
      id: product.id,
      name: product.name,
      thumbnail: product.thumbnail,
      price: product.price,
      pickupDate,
      pickupPlace,
    });
  };

  return (
    <Link
      href={`/demo/gamja-market/products/${product.id}`}
      className="flex gap-4 px-4 py-5 active:bg-black/[0.02]"
    >
      <div className="relative h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-[6px] bg-gray-100">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        {product.stockBadge ? (
          <div className="absolute left-2 top-2 rounded border border-red-200 bg-white px-1.5 py-0.5 text-[11px] font-bold text-red-500">
            {product.stockBadge}
          </div>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-gray-800">
            {product.name}
          </h3>
          <p className="mt-1 text-[18px] font-bold text-gray-900">
            {product.price.toLocaleString()}원
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            누적 판매 {product.soldCount}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[11px] text-gray-400">
            {product.pickupLabel}
          </span>
          <div
            className="flex items-center"
            onClick={(e) => e.preventDefault()}
          >
            <button
              type="button"
              onClick={handleDecrease}
              disabled={quantity === 0}
              aria-label="수량 감소"
              className="flex h-9 w-9 items-center justify-center rounded-l-md border border-gray-300 bg-white disabled:cursor-not-allowed"
            >
              <Minus
                className={`h-4 w-4 ${quantity === 0 ? "text-gray-300" : "text-gray-700"}`}
              />
            </button>
            <div className="flex h-9 w-9 items-center justify-center border-y border-gray-300 bg-white">
              <span className="text-[13px] font-semibold text-gray-900">
                {quantity}
              </span>
            </div>
            <button
              type="button"
              onClick={handleIncrease}
              aria-label="수량 증가"
              className="flex h-9 w-9 items-center justify-center rounded-r-md border border-gray-300 bg-white"
            >
              <Plus className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
