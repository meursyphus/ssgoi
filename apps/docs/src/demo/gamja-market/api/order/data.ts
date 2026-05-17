import type { OrderDetail, OrderStatus } from "./types";

type SeedOrder = OrderDetail;

const initialSeed: SeedOrder[] = [
  {
    id: "o-001",
    productId: "p-002",
    productName: "GAP인증 고랭지재배 유러피안샐러드 1kg",
    thumbnail: "/demo/gamja-market/salad.jpg",
    quantity: 2,
    unitPrice: 8900,
    totalPrice: 17800,
    status: "picked_up",
    statusLabel: "픽업완료",
    orderedAt: "2026.05.10",
    pickupLabel: "2026.05.13(수) 픽업완료",
    pickupDate: "2026년 5월 13일 (수)",
    pickupPlace: "올림픽파크포레온점 1층 픽업존",
    reviewWritten: false,
  },
  {
    id: "o-002",
    productId: "p-005",
    productName: "[특가] 영자어묵 진짜 쌀떡볶이 505g",
    thumbnail: "/demo/gamja-market/tteokbokki-rice.jpg",
    quantity: 1,
    unitPrice: 10900,
    totalPrice: 10900,
    status: "ready",
    statusLabel: "픽업 대기중",
    orderedAt: "2026.05.15",
    pickupLabel: "2026.05.20(화) 픽업예정",
    pickupDate: "2026년 5월 20일 (화)",
    pickupPlace: "올림픽파크포레온점 1층 픽업존",
    reviewWritten: false,
  },
  {
    id: "o-003",
    productId: "p-001",
    productName: "갓튀긴 어포튀각 80g",
    thumbnail: "/demo/gamja-market/eopo.jpg",
    quantity: 1,
    unitPrice: 3300,
    totalPrice: 3300,
    status: "picked_up",
    statusLabel: "픽업완료",
    orderedAt: "2026.04.28",
    pickupLabel: "2026.05.01(금) 픽업완료",
    pickupDate: "2026년 5월 1일 (금)",
    pickupPlace: "올림픽파크포레온점 1층 픽업존",
    reviewWritten: true,
  },
];

const orders: SeedOrder[] = initialSeed.map((o) => ({ ...o }));

let counter = orders.length + 1;

export const data = {
  all: () => orders.map((o) => ({ ...o })),
  byId: (id: string) => {
    const found = orders.find((o) => o.id === id);
    return found ? { ...found } : null;
  },
  create: (input: Omit<SeedOrder, "id">): SeedOrder => {
    const id = `o-${String(counter++).padStart(3, "0")}`;
    const next: SeedOrder = { ...input, id };
    orders.unshift(next);
    return { ...next };
  },
  markReviewWritten: (id: string) => {
    const found = orders.find((o) => o.id === id);
    if (found) found.reviewWritten = true;
  },
};

export function statusToLabel(status: OrderStatus): string {
  if (status === "pending") return "결제 대기";
  if (status === "ready") return "픽업 대기중";
  return "픽업완료";
}
