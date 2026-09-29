import type { OrderSimple } from "@/demo/gamja-market/api/order";

/** The pickup store every group-buy order is chatted with. */
export const store = {
  name: "올림픽파크포레온점",
  avatar: "/gamja-market-icon.svg",
  region: "둔촌동",
};

export function lastMessageFor(order: OrderSimple): string {
  if (order.status === "pending") {
    return "입금 확인 중이에요. 확인되면 픽업 일정을 알려드릴게요.";
  }
  if (order.status === "ready") {
    return "주문하신 상품 준비가 끝났어요! 픽업일에 1층 픽업존으로 와주세요.";
  }
  if (!order.reviewWritten) {
    return "맛있게 드셨나요? 후기를 남겨주시면 이웃들에게 큰 도움이 돼요.";
  }
  return "소중한 후기 고마워요! 다음 공구도 기대해 주세요 :)";
}

export function unreadCountFor(order: OrderSimple): number {
  if (order.status === "ready") return 1;
  if (order.status === "picked_up" && !order.reviewWritten) return 2;
  return 0;
}

/** "2026.05.15" → "5월 15일" */
export function chatTime(orderedAt: string): string {
  const [, month, day] = orderedAt.split(".");
  return `${Number(month)}월 ${Number(day)}일`;
}
