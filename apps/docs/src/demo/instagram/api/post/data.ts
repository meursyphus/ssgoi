import type {
  PostAuthor,
  PostComment,
  PostDetail,
  PostSimple,
  Reel,
  ReelDetail,
  TaggedPost,
} from "./types";

// 공통 댓글 풀 — post마다 4~7개 잘라서 씀
const COMMENT_POOL: Omit<PostComment, "id">[] = [
  {
    user: "miso_devv",
    text: "오 분위기 좋다 🤍",
    likesLabel: "좋아요 12개",
    whenLabel: "1시간",
    avatar: "https://picsum.photos/seed/comment-miso/80/80",
  },
  {
    user: "haru_oc",
    text: "이거 어디에요?? 가보고 싶다",
    likesLabel: "좋아요 4개",
    whenLabel: "2시간",
    avatar: "https://picsum.photos/seed/comment-haru/80/80",
  },
  {
    user: "kim__sj",
    text: "사진 진짜 잘 찍으심",
    likesLabel: "좋아요 8개",
    whenLabel: "3시간",
    avatar: "https://picsum.photos/seed/comment-kim/80/80",
  },
  {
    user: "alex.chen",
    text: "이번 시리즈 다 좋네요 👀",
    likesLabel: "좋아요 2개",
    whenLabel: "5시간",
    avatar: "https://picsum.photos/seed/comment-alex/80/80",
  },
  {
    user: "moon_taeyong",
    text: "🔥🔥🔥",
    likesLabel: "좋아요 1개",
    whenLabel: "6시간",
    avatar: "https://picsum.photos/seed/comment-moon/80/80",
  },
  {
    user: "yoon_dt",
    text: "이거 보고 저도 한 장 찍으러 나가야겠어요",
    likesLabel: "좋아요 3개",
    whenLabel: "10시간",
    avatar: "https://picsum.photos/seed/comment-yoon/80/80",
  },
  {
    user: "jihye.k",
    text: "썸네일부터 이미 작품",
    likesLabel: "좋아요 5개",
    whenLabel: "12시간",
    avatar: "https://picsum.photos/seed/comment-jihye/80/80",
  },
  {
    user: "neo_park",
    text: "근데 카메라 뭐 쓰세요? 👀",
    likesLabel: "좋아요 2개",
    whenLabel: "1일",
    avatar: "https://picsum.photos/seed/comment-neo/80/80",
  },
  {
    user: "rena_films",
    text: "스토리에도 올려주세요 ㅎㅎ",
    likesLabel: "좋아요 0개",
    whenLabel: "1일",
    avatar: "https://picsum.photos/seed/comment-rena/80/80",
  },
  {
    user: "ssoo_o",
    text: "와... 색감 미쳤다",
    likesLabel: "좋아요 7개",
    whenLabel: "1일",
    avatar: "https://picsum.photos/seed/comment-ssoo/80/80",
  },
  {
    user: "byungjun_",
    text: "💯💯",
    likesLabel: "좋아요 1개",
    whenLabel: "2일",
    avatar: "https://picsum.photos/seed/comment-bj/80/80",
  },
  {
    user: "studio.daily",
    text: "공유해도 될까요? 🙏",
    likesLabel: "좋아요 0개",
    whenLabel: "2일",
    avatar: "https://picsum.photos/seed/comment-studio/80/80",
  },
];

function commentsFor(
  postId: string,
  count: number,
  /** 작성자 본인 댓글은 빼고 채운다 (친구 게시물) */
  author?: string,
): PostComment[] {
  // post id를 hash 삼아 시작 index 결정 — 결정적이지만 post마다 다른 댓글 조합
  let h = 0;
  for (let i = 0; i < postId.length; i++)
    h = (h * 31 + postId.charCodeAt(i)) >>> 0;
  const start = h % COMMENT_POOL.length;
  const pool = Array.from(
    { length: COMMENT_POOL.length },
    (_, i) => COMMENT_POOL[(start + i) % COMMENT_POOL.length],
  ).filter((c) => c.user !== author);
  return pool
    .slice(0, count)
    .map((src, i) => ({ ...src, id: `${postId}-c${i + 1}` }));
}

type PostSeed = Omit<PostDetail, "topComments"> & { commentCount: number };

const seed: PostSeed[] = [
  {
    id: "p-001",
    image: "https://picsum.photos/seed/insta-desk/600/600",
    kind: "video",
    caption: "오후의 데스크 셋업. 햇살 좋다",
    likes: 142,
    comments: 8,
    likesLabel: "좋아요 142개",
    commentsLabel: "댓글 8개 모두 보기",
    publishedAtLabel: "2일 전",
    commentCount: 4,
  },
  {
    id: "p-002",
    image: "https://picsum.photos/seed/insta-tax/600/600",
    kind: "image",
    caption: "홍길동 세무사 랜딩 페이지 작업 — 카피와 톤을 다시 다듬는 중.",
    likes: 86,
    comments: 3,
    likesLabel: "좋아요 86개",
    commentsLabel: "댓글 3개 모두 보기",
    publishedAtLabel: "4일 전",
    commentCount: 3,
  },
  {
    id: "p-003",
    image: "https://picsum.photos/seed/insta-backpack/600/600",
    kind: "image",
    caption: "퇴근길 하늘이 너무 예뻐서 한 장.",
    likes: 231,
    comments: 17,
    likesLabel: "좋아요 231개",
    commentsLabel: "댓글 17개 모두 보기",
    publishedAtLabel: "1주 전",
    commentCount: 6,
  },
  {
    id: "p-004",
    image: "https://picsum.photos/seed/insta-cat/600/600",
    kind: "carousel",
    caption: "골목길에서 만난 친구. 자고 있길래 한 컷.",
    likes: 412,
    comments: 41,
    likesLabel: "좋아요 412개",
    commentsLabel: "댓글 41개 모두 보기",
    publishedAtLabel: "1주 전",
    commentCount: 7,
  },
  {
    id: "p-005",
    image: "https://picsum.photos/seed/insta-blog/600/600",
    kind: "image",
    caption: "블로그 위젯 시리즈 4편 — Align, FractionallySizedBox, Center.",
    likes: 64,
    comments: 2,
    likesLabel: "좋아요 64개",
    commentsLabel: "댓글 2개 모두 보기",
    publishedAtLabel: "2주 전",
    commentCount: 4,
  },
  {
    id: "p-006",
    image: "https://picsum.photos/seed/insta-portrait/600/600",
    kind: "image",
    caption: "스킬: sveltekit · react · spring boot · kotlin",
    likes: 178,
    comments: 11,
    likesLabel: "좋아요 178개",
    commentsLabel: "댓글 11개 모두 보기",
    publishedAtLabel: "2주 전",
    commentCount: 5,
  },
  {
    id: "p-007",
    image: "https://picsum.photos/seed/insta-coffee/600/600",
    kind: "image",
    caption: "아침 루틴. 커피 한 잔 + 오늘 할 일 정리.",
    likes: 98,
    comments: 5,
    likesLabel: "좋아요 98개",
    commentsLabel: "댓글 5개 모두 보기",
    publishedAtLabel: "3주 전",
    commentCount: 5,
  },
  {
    id: "p-008",
    image: "https://picsum.photos/seed/insta-sunset/600/600",
    kind: "image",
    caption: "노을. 더 할 말이 없다.",
    likes: 305,
    comments: 22,
    likesLabel: "좋아요 305개",
    commentsLabel: "댓글 22개 모두 보기",
    publishedAtLabel: "3주 전",
    commentCount: 7,
  },
  {
    id: "p-009",
    image: "https://picsum.photos/seed/insta-keyboard/600/600",
    kind: "image",
    caption: "새 키보드 영입. 손맛이 또 다르네.",
    likes: 73,
    comments: 4,
    likesLabel: "좋아요 73개",
    commentsLabel: "댓글 4개 모두 보기",
    publishedAtLabel: "4주 전",
    commentCount: 4,
  },
  {
    id: "p-010",
    image: "https://picsum.photos/seed/insta-walk/600/600",
    kind: "video",
    caption: "동네 산책. 한 바퀴 돌고 오면 머리가 맑아짐.",
    likes: 121,
    comments: 9,
    likesLabel: "좋아요 121개",
    commentsLabel: "댓글 9개 모두 보기",
    publishedAtLabel: "5주 전",
    commentCount: 5,
  },
  {
    id: "p-011",
    image: "https://picsum.photos/seed/insta-screen/600/600",
    kind: "image",
    caption: "스벨트로 페이지 트랜지션 구현하기 — 1편 시작.",
    likes: 187,
    comments: 14,
    likesLabel: "좋아요 187개",
    commentsLabel: "댓글 14개 모두 보기",
    publishedAtLabel: "6주 전",
    commentCount: 6,
  },
];

// 친구들이 올리고 나를 태그한 게시물 — 태그됨 탭과 홈 피드에서 열린다
const FRIENDS: Record<string, PostAuthor> = {
  miso: {
    username: "miso_devv",
    avatar: "https://picsum.photos/seed/comment-miso/160/160",
  },
  haru: {
    username: "haru_oc",
    avatar: "https://picsum.photos/seed/comment-haru/160/160",
  },
  kim: {
    username: "kim__sj",
    avatar: "https://picsum.photos/seed/comment-kim/160/160",
  },
  rena: {
    username: "rena_films",
    avatar: "https://picsum.photos/seed/comment-rena/160/160",
  },
};

const taggedSeed: PostSeed[] = [
  {
    id: "t-001",
    image: "https://picsum.photos/seed/tagged-1/600/600",
    kind: "image",
    caption: "주말 성수 카페 투어 ☕️ 사진은 @deaseungseung94 가 찍어줌",
    likes: 57,
    comments: 6,
    likesLabel: "좋아요 57개",
    commentsLabel: "댓글 6개 모두 보기",
    publishedAtLabel: "1일 전",
    commentCount: 5,
    author: FRIENDS.miso,
  },
  {
    id: "t-002",
    image: "https://picsum.photos/seed/tagged-2/600/600",
    kind: "image",
    caption: "오랜만에 다 같이 한강 🌊 @deaseungseung94 다음엔 자전거 타자",
    likes: 89,
    comments: 12,
    likesLabel: "좋아요 89개",
    commentsLabel: "댓글 12개 모두 보기",
    publishedAtLabel: "3일 전",
    commentCount: 6,
    author: FRIENDS.haru,
  },
  {
    id: "t-003",
    image: "https://picsum.photos/seed/tagged-3/600/600",
    kind: "image",
    caption: "스터디 끝나고 한 컷. 다음 주 발표도 화이팅 @deaseungseung94",
    likes: 34,
    comments: 3,
    likesLabel: "좋아요 34개",
    commentsLabel: "댓글 3개 모두 보기",
    publishedAtLabel: "5일 전",
    commentCount: 3,
    author: FRIENDS.kim,
  },
  {
    id: "t-004",
    image: "https://picsum.photos/seed/tagged-4/600/600",
    kind: "image",
    caption: "필름으로 담은 을지로 골목 📷 모델 @deaseungseung94",
    likes: 126,
    comments: 9,
    likesLabel: "좋아요 126개",
    commentsLabel: "댓글 9개 모두 보기",
    publishedAtLabel: "1주 전",
    commentCount: 5,
    author: FRIENDS.rena,
  },
];

const toDetail = ({ commentCount, ...rest }: PostSeed): PostDetail => ({
  ...rest,
  topComments: commentsFor(rest.id, commentCount, rest.author?.username),
});

// 내 게시물(그리드)과 친구 게시물(태그됨) — 상세 조회는 둘 다 가능
const posts: PostDetail[] = seed.map(toDetail);
const friendPosts: PostDetail[] = taggedSeed.map(toDetail);
const allPosts: PostDetail[] = [...posts, ...friendPosts];

const ME: PostAuthor = {
  username: "deaseungseung94",
  avatar: "https://picsum.photos/seed/dsmoon-avatar/200/200",
};

const reels: ReelDetail[] = [
  {
    id: "r-001",
    image: "https://picsum.photos/seed/reel-1/400/700",
    viewsLabel: "1.2만",
    caption: "퇴근하고 한강까지 30분 러닝 🏃 오늘 페이스 5'40\"",
    likesLabel: "1,284",
    commentsLabel: "46",
    sharesLabel: "112",
    audioLabel: "deaseungseung94 · 원본 오디오",
    author: ME,
  },
  {
    id: "r-002",
    image: "https://picsum.photos/seed/reel-2/400/700",
    viewsLabel: "8.8천",
    caption: "데스크 셋업 타임랩스. 케이블 정리만 두 시간 걸림",
    likesLabel: "731",
    commentsLabel: "28",
    sharesLabel: "54",
    audioLabel: "Lo-fi Study · Chill Beats",
    author: ME,
  },
  {
    id: "r-003",
    image: "https://picsum.photos/seed/reel-3/400/700",
    viewsLabel: "2.4만",
    caption: "ssgoi로 만든 페이지 트랜지션 모음 ✨ 링크는 프로필에",
    likesLabel: "3,102",
    commentsLabel: "187",
    sharesLabel: "640",
    audioLabel: "deaseungseung94 · 원본 오디오",
    author: ME,
  },
  {
    id: "r-004",
    image: "https://picsum.photos/seed/reel-4/400/700",
    viewsLabel: "5.9천",
    caption: "주말 아침 핸드드립 루틴 ☕️",
    likesLabel: "402",
    commentsLabel: "15",
    sharesLabel: "21",
    audioLabel: "Morning Jazz · Cafe Playlist",
    author: ME,
  },
  {
    id: "r-005",
    image: "https://picsum.photos/seed/reel-5/400/700",
    viewsLabel: "1.7만",
    caption: "제주 3박 4일 1분 요약 🍊",
    likesLabel: "2,245",
    commentsLabel: "98",
    sharesLabel: "310",
    audioLabel: "deaseungseung94 · 원본 오디오",
    author: ME,
  },
  {
    id: "r-006",
    image: "https://picsum.photos/seed/reel-6/400/700",
    viewsLabel: "3.1천",
    caption: "새 키보드 타건음 ASMR ⌨️",
    likesLabel: "268",
    commentsLabel: "12",
    sharesLabel: "9",
    audioLabel: "deaseungseung94 · 원본 오디오",
    author: ME,
  },
];

const tagged: TaggedPost[] = [
  {
    id: "t-001",
    image: "https://picsum.photos/seed/tagged-1/600/600",
    userLabel: "@miso_devv",
  },
  {
    id: "t-002",
    image: "https://picsum.photos/seed/tagged-2/600/600",
    userLabel: "@haru_oc",
  },
  {
    id: "t-003",
    image: "https://picsum.photos/seed/tagged-3/600/600",
    userLabel: "@kim__sj",
  },
  {
    id: "t-004",
    image: "https://picsum.photos/seed/tagged-4/600/600",
    userLabel: "@rena_films",
  },
];

// 탐색 탭: 내 게시물과 친구 게시물을 섞은 고정 순서 (API가 정렬 책임)
const EXPLORE_ORDER = [
  "t-001",
  "p-004",
  "p-008",
  "t-002",
  "p-003",
  "p-011",
  "t-004",
  "p-006",
  "p-001",
  "t-003",
  "p-010",
  "p-002",
  "p-009",
  "p-005",
  "p-007",
];

// 홈 피드: 팔로우 중인 친구 게시물 사이에 내 최근 게시물
const FEED_ORDER = ["t-001", "p-001", "t-002", "t-004", "t-003"];

const clone = (p: PostDetail): PostDetail => ({
  ...p,
  topComments: p.topComments.map((c) => ({ ...c })),
});

const byId = (id: string) => allPosts.find((p) => p.id === id) ?? null;

export const data = {
  all: () => posts.map(clone),
  byId: (id: string) => {
    const found = byId(id);
    return found ? clone(found) : null;
  },
  reels: (): Reel[] =>
    reels.map(({ id, image, viewsLabel }) => ({ id, image, viewsLabel })),
  reelById: (id: string) => {
    const found = reels.find((r) => r.id === id);
    return found ? { ...found, author: { ...found.author } } : null;
  },
  // 댓글 시트: "댓글 N개 모두 보기"의 N만큼 (공통 풀 크기까지)
  comments: (id: string): PostComment[] | null => {
    const found = byId(id);
    if (!found) return null;
    const count = Math.max(found.comments, found.topComments.length);
    return commentsFor(id, count, found.author?.username);
  },
  tagged: () => tagged.map((t) => ({ ...t })),
  explore: (): PostSimple[] =>
    EXPLORE_ORDER.map((id) => byId(id))
      .filter((p): p is PostDetail => p !== null)
      .map(({ id, image, kind }) => ({ id, image, kind })),
  feed: (): PostDetail[] =>
    FEED_ORDER.map((id) => byId(id))
      .filter((p): p is PostDetail => p !== null)
      .map(clone),
};
