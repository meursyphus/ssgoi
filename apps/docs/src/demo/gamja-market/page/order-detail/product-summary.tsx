import { ChevronRight } from "lucide-react";
import { Link } from "@/lib/link";
import type { OrderDetail } from "@/demo/gamja-market/state/order";
import { routes } from "@/demo/gamja-market/page/shared/routes";

export function ProductSummary({ order }: { order: OrderDetail }) {
  return (
    <section className="mt-2 bg-white px-4 py-5">
      <h2 className="text-[13px] font-semibold text-gray-900">주문 상품</h2>
      <Link
        href={routes.product(order.productId)}
        scroll={false}
        className="-mx-2 mt-1 flex items-center gap-3 rounded-lg px-2 py-2 active:bg-black/[0.03]"
      >
        <div className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[6px] bg-gray-100">
          <img
            src={order.thumbnail}
            alt={order.productName}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="line-clamp-2 text-[14px] font-medium text-gray-800">
            {order.productName}
          </p>
          <p className="mt-1 text-[12px] text-gray-500">
            {order.unitPrice.toLocaleString()}원 · {order.quantity}개
          </p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
      </Link>
    </section>
  );
}
