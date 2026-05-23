import type { PinDetail } from "./types";

const authors = [
  {
    name: "Emma Wilson",
    avatar: "https://picsum.photos/seed/pinterest-avatar-1/96/96",
    followers: 5432,
    bio: "라이프스타일 매거진 에디터, 일상의 영감을 공유합니다",
  },
  {
    name: "Alex Chen",
    avatar: "https://picsum.photos/seed/pinterest-avatar-2/96/96",
    followers: 8765,
    bio: "프로덕트 디자이너 · 미니멀리스트",
  },
  {
    name: "Sarah Kim",
    avatar: "https://picsum.photos/seed/pinterest-avatar-3/96/96",
    followers: 3210,
    bio: "포토그래퍼, 빛과 그림자를 기록합니다",
  },
  {
    name: "Mike Davis",
    avatar: "https://picsum.photos/seed/pinterest-avatar-4/96/96",
    followers: 9876,
    bio: "DIY 크리에이터 · 손으로 만드는 사람",
  },
  {
    name: "Lisa Park",
    avatar: "https://picsum.photos/seed/pinterest-avatar-5/96/96",
    followers: 6543,
    bio: "패션 스타일리스트, 매일의 룩을 큐레이션합니다",
  },
];

const seed: PinDetail[] = [
  {
    id: "pin-1",
    title: "AI 메이크업 인물 컨셉",
    image: "https://picsum.photos/seed/pinterest-pin-1/400/400",
    aspectRatio: "1 / 1",
    category: "Beauty",
    saves: 4123,
    author: authors[0],
    description:
      "Glittery eye makeup with iridescent highlights. AI generated reference for editorial beauty shoot.",
    tags: ["beauty", "editorial", "makeup", "ai"],
    domain: "studio.beauty",
  },
  {
    id: "pin-2",
    title: "Black ink fountain pen — desk flat lay",
    image: "https://picsum.photos/seed/pinterest-pin-2/400/667",
    aspectRatio: "3 / 5",
    category: "만년필",
    saves: 2890,
    author: authors[1],
    description:
      "Minimal stationery flat lay with a Sailor Pro Gear fountain pen on slate background.",
    tags: ["stationery", "fountain-pen", "minimal", "desk"],
    domain: "deskmag.co",
  },
  {
    id: "pin-3",
    title: "남자로 안 느껴지는 남자 특징",
    image: "https://picsum.photos/seed/pinterest-pin-3/400/800",
    aspectRatio: "2 / 4",
    category: "코디",
    saves: 1567,
    author: authors[2],
    description:
      "베이지 톤 셋업 코디. 여성스러운 실루엣과 부드러운 색감이 포인트.",
    tags: ["코디", "데일리", "남자친구룩"],
    domain: "ootd.kr",
  },
  {
    id: "pin-4",
    title: "Vertical 2:3 Inspiration — Style guides AI",
    image: "https://picsum.photos/seed/pinterest-pin-4/400/533",
    aspectRatio: "3 / 4",
    category: "Design",
    saves: 3678,
    author: authors[1],
    description:
      "Procreate UI inspiration board — color tokens, type scale and spacing for vertical 2:3 frames.",
    tags: ["ui", "design-system", "vertical", "ai"],
    domain: "procreate.art",
  },
  {
    id: "pin-5",
    title: "여자 치마 — pleated mini skirt look",
    image: "https://picsum.photos/seed/pinterest-pin-5/400/1000",
    aspectRatio: "2 / 5",
    category: "여자 치마",
    saves: 4567,
    author: authors[4],
    description: "체크 플리츠 미니 스커트 + 크롭 후드 코디. 데일리 캐주얼.",
    tags: ["여자치마", "플리츠", "데일리룩"],
    domain: "lookbook.kr",
  },
  {
    id: "pin-6",
    title: "검정 플리츠 스커트 디테일",
    image: "https://picsum.photos/seed/pinterest-pin-6/400/800",
    aspectRatio: "1 / 2",
    category: "여자 치마",
    saves: 890,
    author: authors[4],
    description: "허리 라인을 강조한 미니 플리츠. 검정 톤 미니멀.",
    tags: ["여자치마", "플리츠", "블랙"],
    domain: "musinsa.com",
  },
  {
    id: "pin-7",
    title: "Morimono-inspired wedding tablescape",
    image: "https://picsum.photos/seed/pinterest-pin-7/400/600",
    aspectRatio: "2 / 3",
    category: "Wedding",
    saves: 2456,
    author: authors[0],
    description:
      "Lush wedding tablescape inspired by Japanese 'morimono' produce arrangement.",
    tags: ["wedding", "tablescape", "florals", "morimono"],
    domain: "vogueweddings.com",
  },
  {
    id: "pin-8",
    title: "테무 코리아 — pleated mini",
    image: "https://picsum.photos/seed/pinterest-pin-8/400/667",
    aspectRatio: "3 / 5",
    category: "여자 치마",
    saves: 1234,
    author: authors[4],
    description: "Temu_Korea x SassyGals 컬렉션. 아메리칸 캐주얼 스타일.",
    tags: ["여자치마", "캐주얼", "데일리"],
    domain: "temu.kr",
  },
  {
    id: "pin-9",
    title: "버거킹 와퍼 단품 한판이오 17%",
    image: "https://picsum.photos/seed/pinterest-pin-9/400/400",
    aspectRatio: "1 / 1",
    category: "광고",
    saves: 678,
    author: authors[2],
    description: "11,500원 한정 특가. 데이즈 잇츠 한정 할인.",
    tags: ["광고", "쿠팡이츠", "프로모션"],
    domain: "coupangeats.com",
  },
  {
    id: "pin-10",
    title: "Study room decor — soft warm light",
    image: "https://picsum.photos/seed/pinterest-pin-10/400/667",
    aspectRatio: "3 / 5",
    category: "Study room decor",
    saves: 3234,
    author: authors[3],
    description:
      "포근한 무드의 스터디룸. 데스크 램프와 무광 마감 가구로 집중력을 높여보세요.",
    tags: ["studyroom", "interior", "decor"],
    domain: "houzz.com",
  },
  {
    id: "pin-11",
    title: "Procreate brush study — landscape",
    image: "https://picsum.photos/seed/pinterest-pin-11/400/800",
    aspectRatio: "1 / 2",
    category: "Art",
    saves: 1890,
    author: authors[1],
    description: "Brush exploration for landscape illustration in Procreate.",
    tags: ["procreate", "illustration", "study"],
    domain: "procreate.art",
  },
  {
    id: "pin-12",
    title: "겨울 코디 — 모직 코트 톤온톤",
    image: "https://picsum.photos/seed/pinterest-pin-12/400/533",
    aspectRatio: "3 / 4",
    category: "겨울코디",
    saves: 2345,
    author: authors[4],
    description: "베이지 모직 롱코트 + 니트 톤온톤. 데이트 무드 코디.",
    tags: ["겨울코디", "톤온톤", "데이트룩"],
    domain: "stylenanda.com",
  },
  {
    id: "pin-13",
    title: "Floral wedding bouquet — pale pink",
    image: "https://picsum.photos/seed/pinterest-pin-13/400/1000",
    aspectRatio: "2 / 5",
    category: "Wedding",
    saves: 4567,
    author: authors[0],
    description: "Soft pale pink and white floral bouquet for spring wedding.",
    tags: ["wedding", "bouquet", "florals"],
    domain: "marthastewart.com",
  },
  {
    id: "pin-14",
    title: "정장 룩북 — 블랙 셋업",
    image: "https://picsum.photos/seed/pinterest-pin-14/400/800",
    aspectRatio: "1 / 2",
    category: "정장",
    saves: 1567,
    author: authors[4],
    description: "단정한 블랙 셋업 정장. 면접·결혼식 룩북.",
    tags: ["정장", "셋업", "포멀"],
    domain: "ssense.com",
  },
  {
    id: "pin-15",
    title: "멋진 발명품 — 무드등 컨셉",
    image: "https://picsum.photos/seed/pinterest-pin-15/400/600",
    aspectRatio: "2 / 3",
    category: "멋진 발명품",
    saves: 3456,
    author: authors[3],
    description: "감성 무드등 컨셉 디자인. 모듈러 조립식 구조.",
    tags: ["product", "design", "lighting"],
    domain: "yankodesign.com",
  },
];

export const data = {
  all: () => seed.map((p) => ({ ...p })),
  byId: (id: string) => {
    const found = seed.find((p) => p.id === id);
    return found ? { ...found } : null;
  },
  search: (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return seed.map((p) => ({ ...p }));
    return seed
      .filter(
        (p) =>
          p.category.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .map((p) => ({ ...p }));
  },
};
