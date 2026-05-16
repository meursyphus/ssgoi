"use client";

import { useRouter } from "next/navigation";
import { PenLine } from "lucide-react";
import { useOrder } from "@/demo/gamja-market/state/order";

export function ReviewFab() {
  const router = useRouter();
  const order = useOrder((state) => ({ orders: state.orders }));

  const handleClick = () => {
    const candidate = order.orders.data.find(
      (o) => o.status === "picked_up" && !o.reviewWritten,
    );
    if (candidate) {
      router.push(`/demo/gamja-market/review/${candidate.id}`);
    } else {
      router.push(`/demo/gamja-market/orders`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="리뷰 작성"
      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00AE42] shadow-lg shadow-black/15 transition-colors hover:bg-[#009938]"
    >
      <PenLine className="h-6 w-6 text-white" />
    </button>
  );
}
