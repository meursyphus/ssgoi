import type { OrderDetail } from "@/demo/gamja-market/state/order";

export function ProductSummary({ order }: { order: OrderDetail }) {
  return (
    <section className="mt-2 bg-white px-4 py-5">
      <h2 className="text-[13px] font-semibold text-gray-900">주문 상품</h2>
      <div className="mt-3 flex gap-3">
        <div className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[6px] bg-gray-100">
          <img
            src={order.thumbnail}
            alt={order.productName}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <p className="line-clamp-2 text-[14px] font-medium text-gray-800">
            {order.productName}
          </p>
          <p className="mt-1 text-[12px] text-gray-500">
            {order.unitPrice.toLocaleString()}원 · {order.quantity}개
          </p>
        </div>
      </div>
    </section>
  );
}
