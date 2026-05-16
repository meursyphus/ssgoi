import type { OrderDetail } from "@/demo/gamja-market/state/order";

export function PaymentSummary({ order }: { order: OrderDetail }) {
  return (
    <section className="mt-2 bg-white px-4 py-5">
      <h2 className="text-[13px] font-semibold text-gray-900">결제 정보</h2>
      <dl className="mt-3 space-y-2 text-[13px]">
        <div className="flex justify-between text-gray-600">
          <dt>상품 금액</dt>
          <dd>
            {order.unitPrice.toLocaleString()}원 × {order.quantity}
          </dd>
        </div>
        <div className="flex justify-between text-gray-600">
          <dt>픽업비</dt>
          <dd>0원</dd>
        </div>
        <div className="mt-2 flex justify-between border-t border-gray-100 pt-3 text-[14px] font-bold text-gray-900">
          <dt>최종 결제 금액</dt>
          <dd>{order.totalPrice.toLocaleString()}원</dd>
        </div>
      </dl>
    </section>
  );
}
