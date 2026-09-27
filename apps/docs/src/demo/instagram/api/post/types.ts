export interface PostAPI {
  /** 프로필 그리드용 게시물 목록 */
  findAll: () => Promise<PostSimple[]>;
  /** 게시물 상세 */
  find: (id: string) => Promise<PostDetail>;
  /** 댓글 시트 — 게시물의 전체 댓글 */
  findComments: (id: string) => Promise<PostComment[]>;
  /** 릴스 탭 목록 */
  findReels: () => Promise<Reel[]>;
  /** 릴스 뷰어 */
  findReel: (id: string) => Promise<ReelDetail>;
  /** 태그됨 탭 목록 */
  findTagged: () => Promise<TaggedPost[]>;
  /** 탐색 탭 그리드 — 내 게시물과 친구 게시물이 섞인 순서 */
  findExplore: () => Promise<PostSimple[]>;
  /** 홈 피드 — 팔로우 중인 계정 + 내 최근 게시물 */
  findFeed: () => Promise<PostDetail[]>;
}

export type PostKind = "image" | "video" | "carousel";

export type PostSimple = {
  id: string;
  image: string;
  kind: PostKind;
};

/** 다른 사람이 올린 게시물의 작성자. 없으면 내 게시물. */
export type PostAuthor = {
  username: string;
  avatar: string;
};

export type PostDetail = {
  id: string;
  image: string;
  kind: PostKind;
  caption: string;
  likes: number;
  comments: number;
  /** "좋아요 142개" 처럼 표시 그대로 */
  likesLabel: string;
  /** "댓글 8개 모두 보기" */
  commentsLabel: string;
  /** "2일 전" */
  publishedAtLabel: string;
  /** 미리 가공된 인기 댓글 목록 — 상세 페이지 본문 채움 */
  topComments: PostComment[];
  /** 친구가 올린 게시물(태그됨)일 때만 존재 */
  author?: PostAuthor;
};

export type PostComment = {
  id: string;
  user: string;
  text: string;
  likesLabel: string;
  whenLabel: string;
  avatar: string;
};

export type Reel = {
  id: string;
  image: string;
  /** "1.2만" 형태로 미리 가공 */
  viewsLabel: string;
};

export type ReelDetail = Reel & {
  caption: string;
  likesLabel: string;
  commentsLabel: string;
  sharesLabel: string;
  /** "deaseungseung94 · 원본 오디오" */
  audioLabel: string;
  author: PostAuthor;
};

export type TaggedPost = {
  id: string;
  image: string;
  /** "@miso_devv" */
  userLabel: string;
};
