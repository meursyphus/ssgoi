import type { OrderDetail } from "@/demo/gamja-market/state/order";

const STATUS_THEME: Record<
  OrderDetail["status"],
  { bg: string; fg: string; description: string }
> = {
  pending: {
    bg: "bg-amber-50",
    fg: "text-amber-700",
    description: "결제 확인 후 픽업 일정이 안내됩니다.",
  },
  ready: {
    bg: "bg-[#e9f5e0]",
    fg: "text-[#2db400]",
    description: "픽업일에 매장에서 주문번호를 알려주세요.",
  },
  picked_up: {
    bg: "bg-gray-100",
    fg: "text-gray-700",
    description: "이용해 주셔서 감사합니다.",
  },
};

export function StatusBanner({ order }: { order: OrderDetail }) {
  const theme = STATUS_THEME[order.status];
  return (
    <section className={`${theme.bg} px-4 py-5`}>
      <p className={`${theme.fg} text-[17px] font-bold`}>{order.statusLabel}</p>
      <p className="mt-1 text-[12px] text-gray-600">{theme.description}</p>
      <p className="mt-3 text-[12px] text-gray-500">{order.pickupLabel}</p>
    </section>
  );
}
