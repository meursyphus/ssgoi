export interface PostAPI {
  /** 프로필 그리드용 게시물 목록 */
  findAll: () => Promise<PostSimple[]>;
  /** 게시물 상세 */
  find: (id: string) => Promise<PostDetail>;
  /** 릴스 탭 목록 */
  findReels: () => Promise<Reel[]>;
  /** 태그됨 탭 목록 */
  findTagged: () => Promise<TaggedPost[]>;
}

export type PostKind = "image" | "video" | "carousel";

export type PostSimple = {
  id: string;
  image: string;
  kind: PostKind;
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
};

export type Reel = {
  id: string;
  image: string;
  /** "1.2만" 형태로 미리 가공 */
  viewsLabel: string;
};

export type TaggedPost = {
  id: string;
  image: string;
  /** "@friend_a" */
  userLabel: string;
};
