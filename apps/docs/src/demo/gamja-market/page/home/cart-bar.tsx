"use client";

import { Loader2 } from "lucide-react";
import { useCart } from "@/demo/gamja-market/state/cart";
import { useProduct } from "@/demo/gamja-market/state/product";

const FALLBACK_PICKUP_PLACE = "올림픽파크포레온점 1층 픽업존";

function pickupDateFromLabel(label: string): string {
  const match = label.match(/\d{4}\.\d{2}\.\d{2}.*?(?=\s)/);
  return match ? match[0] : "픽업 예정일";
}

export function CartBar() {
  const cart = useCart((state) => ({
    items: state.items,
    isCheckingOut: state.isCheckingOut,
    actions: state.actions,
  }));
  const product = useProduct((state) => ({ products: state.products }));

  const totalQuantity = cart.items.reduce((acc, i) => acc + i.quantity, 0);
  if (totalQuantity === 0) return null;

  const productById = new Map(product.products.data.map((p) => [p.id, p]));

  const totalPrice = cart.items.reduce((acc, i) => {
    const p = productById.get(i.productId);
    return acc + (p?.price ?? 0) * i.quantity;
  }, 0);

  const handleCheckout = () => {
    const metaList = cart.items
      .map((i) => productById.get(i.productId))
      .filter((p): p is NonNullable<typeof p> => !!p)
      .map((p) => ({
        id: p.id,
        name: p.name,
        thumbnail: p.thumbnail,
        price: p.price,
        pickupDate: pickupDateFromLabel(p.pickupLabel),
        pickupPlace: FALLBACK_PICKUP_PLACE,
      }));
    cart.actions.checkout(metaList);
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={cart.isCheckingOut}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2db400] px-6 py-4 text-[15px] font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#25a000] disabled:opacity-70"
    >
      {cart.isCheckingOut ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[13px]">
          {totalQuantity}
        </span>
      )}
      <span>{totalPrice.toLocaleString()}원 주문하기</span>
    </button>
  );
}
