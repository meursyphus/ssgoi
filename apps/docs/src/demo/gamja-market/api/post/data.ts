import type { PostSimple } from "./types";

type SeedPost = Omit<PostSimple, "product"> & { productId: string | null };

const seed: SeedPost[] = [
  {
    id: "post-001",
    category: "공구후기",
    title: "영자어묵 로제떡볶이 진짜 맛있네요",
    body: "어제 픽업해서 저녁으로 먹었는데 소스가 꾸덕하고 어묵이 두툼해요. 1인분이라더니 둘이 먹어도 충분했어요. 1개 남았다던데 고민 중이면 얼른 담으세요!",
    author: "둔촌동떡순이",
    region: "둔촌동",
    time: "2시간 전",
    likeCount: 24,
    commentCount: 7,
    productId: "p-003",
  },
  {
    id: "post-002",
    category: "동네질문",
    title: "어포튀각 아이 간식으로 괜찮을까요?",
    body: "짭조름하다는 후기가 많던데 초등학생 간식으로 줘도 될지 궁금해요. 드셔보신 분들, 매운 맛은 없나요?",
    author: "올림픽파크맘",
    region: "둔촌동",
    time: "5시간 전",
    likeCount: 6,
    commentCount: 12,
    productId: "p-001",
  },
  {
    id: "post-003",
    category: "공구후기",
    title: "가메골 왕만두는 찜기에 쪄야 제맛",
    body: "850g이라 넉넉하고 부추 향이 확 나요. 에어프라이어보다 찜기가 훨씬 촉촉했어요. 다음 공구 열리면 또 살래요.",
    author: "성내동살림꾼",
    region: "성내동",
    time: "어제",
    likeCount: 41,
    commentCount: 9,
    productId: "p-006",
  },
  {
    id: "post-004",
    category: "일상",
    title: "올림픽공원 아침 산책 후 샐러드 픽업",
    body: "아침 7시에 한 바퀴 돌았는데 사람도 적고 선선했어요. 돌아오는 길에 픽업존 들러서 샐러드 받아오니 아침 메뉴 완성!",
    author: "길동러너",
    region: "길동",
    time: "2일 전",
    likeCount: 18,
    commentCount: 3,
    productId: "p-002",
  },
];

export const data = {
  all: () => seed.map((p) => ({ ...p })),
};
