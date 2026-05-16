export interface ProfileAPI {
  /** 현재 로그인된 유저의 프로필 페이지 데이터 */
  getMe: () => Promise<ProfileMe>;
}

export type Highlight = {
  id: string;
  label: string;
  cover: string;
};

export type ProfileMe = {
  username: string;
  name: string;
  bio: string;
  avatar: string;
  isPrivate: boolean;
  hasUnseenStory: boolean;
  /** "111" 처럼 미리 포매팅된 라벨도 함께 — 표시 가공 클라이언트 금지 규칙 */
  postsCount: number;
  followersCount: number;
  followingCount: number;
  postsLabel: string;
  followersLabel: string;
  followingLabel: string;
  highlights: Highlight[];
  speechBubble: string;
};
