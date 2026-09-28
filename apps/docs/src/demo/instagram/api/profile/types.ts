export interface ProfileAPI {
  /** 현재 로그인된 유저의 프로필 페이지 데이터 */
  getMe: () => Promise<ProfileMe>;
  /** 스토리 뷰어 — id = 유저네임(내 스토리/친구 스토리) 또는 hl-<하이라이트 id> */
  findStory: (id: string) => Promise<StoryDetail>;
  /** 홈 상단 스토리 트레이 */
  findStoryTray: () => Promise<StoryTrayItem[]>;
  /** 팔로워/팔로잉 목록 — 탭별로 API가 나눠서 준다 */
  findFollows: () => Promise<Follows>;
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
};

export type StoryFrame = {
  id: string;
  image: string;
};

export type StoryDetail = {
  /** 줌 키로도 쓰인다 — 트레이/아바타/하이라이트의 exit key와 같은 값 */
  id: string;
  /** 헤더에 표시할 이름 (하이라이트면 하이라이트 제목) */
  label: string;
  avatar: string;
  /** "3시간" */
  timeLabel: string;
  isMine: boolean;
  /** 내 스토리일 때 "조회 24명" */
  viewersLabel: string | null;
  frames: StoryFrame[];
};

export type StoryTrayItem = {
  id: string;
  /** "내 스토리" 또는 유저네임 */
  label: string;
  avatar: string;
  isMine: boolean;
  seen: boolean;
};

export type FollowTab = "followers" | "following";

export type FollowUser = {
  id: string;
  username: string;
  name: string;
  avatar: string;
  hasStory: boolean;
  isFollowing: boolean;
};

export type Follows = Record<FollowTab, FollowUser[]>;
