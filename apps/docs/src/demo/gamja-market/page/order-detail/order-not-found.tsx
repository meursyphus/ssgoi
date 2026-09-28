import { Link } from "@/lib/link";
import { routes } from "@/demo/gamja-market/page/shared/routes";
import { OrderDetailHeader } from "./detail-header";

export function OrderNotFound() {
  return (
    <div className="flex min-h-full flex-col bg-[#FAF8F6]">
      <OrderDetailHeader />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-24 text-center">
        <p className="text-[15px] font-semibold text-gray-800">
          주문 내역을 찾을 수 없어요
        </p>
        <p className="text-[13px] text-gray-500">
          새로고침하면 방금 한 주문이 사라져요.
        </p>
        <Link
          href={routes.orders}
          scroll={false}
          className="rounded-lg bg-white px-4 py-2.5 text-[13px] font-semibold text-gray-700 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
        >
          주문 내역 보기
        </Link>
      </div>
    </div>
  );
}
