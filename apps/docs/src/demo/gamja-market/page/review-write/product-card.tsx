import type { OrderDetail } from "@/demo/gamja-market/state/order";

export function ProductCard({ order }: { order: OrderDetail }) {
  return (
    <div className="flex items-center gap-3 bg-white px-4 py-4">
      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-[6px] bg-gray-100">
        <img
          src={order.thumbnail}
          alt={order.productName}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <p className="line-clamp-1 text-[14px] font-medium text-gray-800">
          {order.productName}
        </p>
        <p className="text-[12px] text-gray-400">{order.pickupDate} 픽업</p>
      </div>
    </div>
  );
}
