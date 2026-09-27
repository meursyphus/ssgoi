import type { Guide, PinDetail } from "./types";

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
    tags: ["beauty", "editorial", "makeup", "ai", "aesthetic"],
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
    tags: ["ui", "design-system", "vertical", "ai", "aesthetic"],
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
    tags: ["studyroom", "interior", "decor", "aesthetic"],
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
    tags: ["procreate", "illustration", "study", "aesthetic"],
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
    tags: ["wedding", "bouquet", "florals", "aesthetic"],
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
    tags: ["product", "design", "lighting", "aesthetic"],
    domain: "yankodesign.com",
  },
];

/** The mock user's boards; `topics` decide which pins belong to each. */
const boards = [
  {
    name: "멋진 발명품",
    pinCount: 38,
    updated: "2일",
    topics: ["멋진 발명품", "product", "lighting", "design", "procreate"],
  },
  {
    name: "Study room decor",
    pinCount: 24,
    updated: "5일",
    topics: ["study", "room", "decor", "interior", "desk", "lighting"],
  },
  {
    name: "만년필",
    pinCount: 17,
    updated: "1주",
    topics: ["만년필", "fountain-pen", "stationery", "illustration", "study"],
  },
  {
    name: "여자 치마",
    pinCount: 52,
    updated: "3주",
    topics: ["여자치마", "플리츠", "코디", "데일리"],
  },
];

/** Pins the mock user saved, newest first. */
const savedIds = [
  "pin-15",
  "pin-10",
  "pin-2",
  "pin-5",
  "pin-12",
  "pin-4",
  "pin-6",
  "pin-11",
  "pin-13",
  "pin-7",
];

/** The signed-in mock user. */
const me = {
  name: "서연",
  handle: "seoyeon.moodboard",
  avatar: "https://picsum.photos/seed/pinterest-me/192/192",
  followers: 128,
  following: 76,
};

/** Inbox updates, newest first. Every row opens a different pin. */
const updates = [
  {
    id: "u-1",
    actor: 0,
    message: "님이 회원님의 핀을 저장했어요",
    time: "2시간",
    isNew: true,
    pinId: "pin-13",
  },
  {
    id: "u-2",
    actor: null,
    message: "회원님을 위한 새 아이디어: 여자 치마 코디",
    time: "5시간",
    isNew: true,
    pinId: "pin-6",
  },
  {
    id: "u-3",
    actor: 1,
    message: "님이 새 핀을 올렸어요: Vertical 2:3 Inspiration",
    time: "1일",
    isNew: false,
    pinId: "pin-4",
  },
  {
    id: "u-4",
    actor: null,
    message: "'Study room decor' 보드에 어울리는 핀 12개",
    time: "2일",
    isNew: false,
    pinId: "pin-10",
  },
  {
    id: "u-5",
    actor: 2,
    message: "님이 회원님의 핀에 댓글을 남겼어요: “색감 너무 예뻐요!”",
    time: "3일",
    isNew: false,
    pinId: "pin-3",
  },
  {
    id: "u-6",
    actor: null,
    message: "지금 인기 있는 아이디어: 겨울 코디",
    time: "1주",
    isNew: false,
    pinId: "pin-12",
  },
];

const chip = (seed: string) => `https://picsum.photos/seed/${seed}/96/96`;

/** Guided-search refinements per topic: [label, thumbnail pin seed]. */
const guidePresets: Record<string, [string, string][]> = {
  "여자 치마": [
    ["코디", "pinterest-pin-5"],
    ["겨울코디", "pinterest-pin-12"],
    ["정장", "pinterest-pin-14"],
    ["청자캐", "pinterest-pin-8"],
    ["데일리", "pinterest-pin-6"],
    ["플리츠", "pinterest-pin-3"],
  ],
  만년필: [
    ["촉", "pinterest-pin-2"],
    ["잉크", "pinterest-pin-11"],
    ["스터디", "pinterest-pin-10"],
    ["필사", "pinterest-pin-4"],
  ],
  "Study room decor": [
    ["조명", "pinterest-pin-15"],
    ["데스크", "pinterest-pin-10"],
    ["선반", "pinterest-pin-12"],
    ["포스터", "pinterest-pin-4"],
  ],
  겨울코디: [
    ["코트", "pinterest-pin-12"],
    ["니트", "pinterest-pin-3"],
    ["롱부츠", "pinterest-pin-14"],
    ["톤온톤", "pinterest-pin-5"],
  ],
  aesthetic: [
    ["배경화면", "pinterest-pin-11"],
    ["무드보드", "pinterest-pin-4"],
    ["홈 화면", "pinterest-pin-15"],
    ["필름 사진", "pinterest-pin-13"],
  ],
  Beauty: [
    ["메이크업", "pinterest-pin-1"],
    ["네일", "pinterest-pin-13"],
    ["헤어스타일", "pinterest-pin-6"],
    ["글리터", "pinterest-pin-7"],
  ],
  Wedding: [
    ["부케", "pinterest-pin-13"],
    ["테이블 세팅", "pinterest-pin-7"],
    ["웨딩드레스", "pinterest-pin-1"],
    ["플라워", "pinterest-pin-15"],
  ],
  Design: [
    ["UI", "pinterest-pin-4"],
    ["타이포그래피", "pinterest-pin-2"],
    ["컬러 팔레트", "pinterest-pin-11"],
    ["포스터", "pinterest-pin-10"],
  ],
  Art: [
    ["일러스트", "pinterest-pin-11"],
    ["드로잉", "pinterest-pin-2"],
    ["수채화", "pinterest-pin-13"],
    ["풍경화", "pinterest-pin-7"],
  ],
  코디: [
    ["데일리룩", "pinterest-pin-3"],
    ["셋업", "pinterest-pin-14"],
    ["캐주얼", "pinterest-pin-8"],
    ["데이트룩", "pinterest-pin-12"],
  ],
  정장: [
    ["하객룩", "pinterest-pin-14"],
    ["면접룩", "pinterest-pin-3"],
    ["오피스룩", "pinterest-pin-12"],
    ["포멀", "pinterest-pin-6"],
  ],
  "멋진 발명품": [
    ["무드등", "pinterest-pin-15"],
    ["조명", "pinterest-pin-10"],
    ["가구", "pinterest-pin-4"],
    ["가젯", "pinterest-pin-2"],
  ],
};

/** Used for queries without a topic of their own. */
const guideFallback: [string, string][] = [
  ["아이디어", "pinterest-pin-5"],
  ["배경화면", "pinterest-pin-11"],
  ["감성", "pinterest-pin-13"],
  ["인테리어", "pinterest-pin-10"],
];

const guideTints: Guide["tint"][] = ["pink", "slate", "lilac"];

/** Pinterest never shows a near-empty grid: pad with more ideas. */
const MIN_RESULTS = 8;

function haystack(pin: PinDetail) {
  return [pin.category, pin.title, pin.description, ...pin.tags]
    .join(" ")
    .toLowerCase();
}

/** Pins matching the most terms first, then more ideas up to MIN_RESULTS. */
function rank(terms: string[]) {
  const scored = seed
    .map((pin) => {
      const text = haystack(pin);
      const score = terms.filter((t) => text.includes(t.toLowerCase())).length;
      return { pin, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.pin);
  // Rotate the filler by the query so every result page looks different.
  const rest = seed.filter((pin) => !scored.includes(pin));
  const offset =
    [...terms.join("")].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
    Math.max(1, rest.length);
  const more = [...rest.slice(offset), ...rest.slice(0, offset)];
  return [
    ...scored,
    ...more.slice(0, Math.max(0, MIN_RESULTS - scored.length)),
  ].map((p) => ({ ...p }));
}

export const data = {
  all: () => seed.map((p) => ({ ...p })),
  byId: (id: string) => {
    const found = seed.find((p) => p.id === id);
    return found ? { ...found } : null;
  },
  /** Tokenized OR search ranked by how many words match. */
  search: (query: string) => {
    const terms = query.trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return seed.map((p) => ({ ...p }));
    return rank(terms);
  },
  /** Home feed for one of the user's boards ("모두" = everything). */
  byBoard: (name: string) => {
    const board = boards.find((b) => b.name === name);
    return board ? rank(board.topics) : seed.map((p) => ({ ...p }));
  },
  saved: () =>
    savedIds.flatMap((id) => {
      const found = seed.find((p) => p.id === id);
      return found ? [{ ...found }] : [];
    }),
  boards: () =>
    boards.map((board) => ({
      name: board.name,
      pinCount: board.pinCount,
      updated: board.updated,
      covers: rank(board.topics)
        .slice(0, 3)
        .map((p) => p.image),
    })),
  me: () => ({ ...me }),
  updates: () =>
    updates.flatMap((update) => {
      const pin = seed.find((p) => p.id === update.pinId);
      if (!pin) return [];
      const actor = update.actor === null ? null : authors[update.actor];
      return [
        {
          id: update.id,
          actor: actor ? { name: actor.name, avatar: actor.avatar } : null,
          message: update.message,
          time: update.time,
          isNew: update.isNew,
          pin: {
            id: pin.id,
            title: pin.title,
            image: pin.image,
            aspectRatio: pin.aspectRatio,
          },
        },
      ];
    }),
  contacts: () =>
    authors.map((author) => ({
      name: author.name,
      shortName: author.name.split(" ")[0],
      avatar: author.avatar,
    })),
  /**
   * A refined query ("여자 치마 코디") keeps offering its topic's other
   * refinements, minus the ones already applied.
   */
  guides: (query: string): Guide[] => {
    const topic = Object.keys(guidePresets).find(
      (key) => query === key || query.startsWith(`${key} `),
    );
    const terms = query.split(/\s+/);
    const unused = (list: [string, string][]) =>
      list.filter(
        ([label]) => !label.split(" ").every((word) => terms.includes(word)),
      );
    const remaining = unused(topic ? guidePresets[topic] : guideFallback);
    const list = remaining.length > 0 ? remaining : unused(guideFallback);
    return list.map(([label, seed], index) => ({
      label,
      thumb: chip(seed),
      tint: guideTints[index % guideTints.length],
    }));
  },
};
