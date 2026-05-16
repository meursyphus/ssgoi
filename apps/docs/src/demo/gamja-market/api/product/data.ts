import type { ProductDetail } from "./types";

const seed: ProductDetail[] = [
  {
    id: "p-001",
    name: "갓튀긴 어포튀각 80g",
    thumbnail: "/demo/gamja-market/eopo.jpg",
    price: 3300,
    pickupLabel: "픽업 2026.05.21(수)",
    soldCount: 215,
    description:
      "남해안 어포를 그날 새벽 튀겨내어 식감이 살아 있습니다. 달짝지근 짭조름한 시즈닝이 입에 감기는 인기 간식.",
    images: ["/demo/gamja-market/eopo.jpg"],
    pickupDate: "2026년 5월 21일 (수)",
    pickupPlace: "올림픽파크포레온점 1층 픽업존",
    notice: "픽업 가능일 익일까지 보관됩니다. 가급적 당일 수령 부탁드려요.",
  },
  {
    id: "p-002",
    name: "GAP인증 고랭지재배 유러피안샐러드 1kg",
    thumbnail: "/demo/gamja-market/salad.jpg",
    price: 8900,
    pickupLabel: "픽업 2026.05.20(화)",
    soldCount: 140,
    description:
      "해발 700m 고랭지에서 GAP 인증으로 키운 신선한 샐러드 채소. 아삭한 식감과 향이 살아있습니다.",
    images: ["/demo/gamja-market/salad.jpg"],
    pickupDate: "2026년 5월 20일 (화)",
    pickupPlace: "올림픽파크포레온점 1층 픽업존",
    notice: "냉장 보관 / 픽업 후 3일 이내 섭취 권장.",
  },
  {
    id: "p-003",
    name: "[특가] 영자어묵 로제어묵떡볶이 480g",
    thumbnail: "/demo/gamja-market/tteokbokki-rose.jpg",
    price: 11900,
    pickupLabel: "픽업 2026.05.18(일)",
    soldCount: 48,
    stockBadge: "1개 남음",
    description:
      "부산 영자어묵으로 만든 진한 로제 떡볶이. 1인 분량으로 데우기만 하면 완성되는 간편식.",
    images: ["/demo/gamja-market/tteokbokki-rose.jpg"],
    pickupDate: "2026년 5월 18일 (일)",
    pickupPlace: "올림픽파크포레온점 1층 픽업존",
    notice: "냉장 보관 / 픽업 후 5일 이내 섭취 권장.",
  },
  {
    id: "p-004",
    name: "[특가] 영자어묵 오리지널 어묵떡볶이 480g",
    thumbnail: "/demo/gamja-market/tteokbokki-original.jpg",
    price: 9900,
    pickupLabel: "픽업 2026.05.18(일)",
    soldCount: 73,
    stockBadge: "2개 남음",
    description:
      "부산 영자어묵 오리지널 어묵떡볶이. 매콤달콤 국민 떡볶이 맛 그대로.",
    images: ["/demo/gamja-market/tteokbokki-original.jpg"],
    pickupDate: "2026년 5월 18일 (일)",
    pickupPlace: "올림픽파크포레온점 1층 픽업존",
    notice: "냉장 보관 / 개봉 후 빨리 드세요.",
  },
  {
    id: "p-005",
    name: "[특가] 영자어묵 진짜 쌀떡볶이 505g",
    thumbnail: "/demo/gamja-market/tteokbokki-rice.jpg",
    price: 10900,
    pickupLabel: "픽업 2026.05.20(화)",
    soldCount: 33,
    description:
      "100% 쌀로 빚은 쫀득한 떡과 부산 영자어묵의 조합. 데우기만 하면 완성.",
    images: ["/demo/gamja-market/tteokbokki-rice.jpg"],
    pickupDate: "2026년 5월 20일 (화)",
    pickupPlace: "올림픽파크포레온점 1층 픽업존",
    notice: "냉장 보관 권장 / 픽업 후 즉시 섭취 권장.",
  },
  {
    id: "p-006",
    name: "가메골 고기왕만두 850g",
    thumbnail: "/demo/gamja-market/mandu.jpg",
    price: 14900,
    pickupLabel: "픽업 2026.05.22(목)",
    soldCount: 87,
    description:
      "60년 전통 가메골 손만두. 국내산 돼지고기와 부추가 듬뿍 들어간 왕만두.",
    images: ["/demo/gamja-market/mandu.jpg"],
    pickupDate: "2026년 5월 22일 (목)",
    pickupPlace: "올림픽파크포레온점 1층 픽업존",
    notice: "냉동 보관 / 찌거나 구워서 드세요.",
  },
];

export const data = {
  all: () => seed.map((p) => ({ ...p })),
  byId: (id: string) => {
    const found = seed.find((p) => p.id === id);
    return found ? { ...found } : null;
  },
};
