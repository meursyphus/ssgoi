export interface FriendAPI {
  /** 즐겨찾기/생일/일반 친구를 묶어서 반환. 일반 친구는 sort 순서 */
  findGroups: (filter?: FriendGroupsFilter) => Promise<FriendGroups>;
  /** 프로필 상세 (추천친구 포함) */
  find: (id: string) => Promise<FriendProfile>;
  /** 내 프로필 (상단 카드) */
  findMe: () => Promise<MeProfile>;
  /** 친구 검색 (이름·상태메시지). 빈 검색어면 즐겨찾는 친구 */
  search: (q: string) => Promise<FriendList>;
  /** 친구 추가 화면의 추천친구 — 이름·카카오톡 ID로 거른다 */
  findRecommended: (q: string) => Promise<FriendList>;
  /** 소식 탭 — 최근 프로필을 업데이트한 친구 */
  findNews: () => Promise<FriendNews>;
  /** 새 채팅 대화상대 선택 — 이름순 전체 친구 */
  findPickable: () => Promise<FriendList>;
}

export type FriendSort = "name" | "updated";

export type FriendGroupsFilter = {
  sort?: FriendSort;
};

export type FriendSimple = {
  id: string;
  name: string;
  /** 상태 메시지 */
  statusMessage: string;
  avatar: string;
  /** 음악 카드 등 추가 표시용 */
  music?: { title: string; artist: string };
};

export type UpcomingBirthday = {
  friend: FriendSimple;
  /** "5월 21일 (목)" */
  dateLabel: string;
};

export type FriendGroups = {
  me: MeProfile;
  birthday: FriendSimple[];
  favorites: FriendSimple[];
  friends: FriendSimple[];
  /** "친구 24" */
  friendsCountLabel: string;
  /** friends 목록의 정렬 기준 */
  sort: FriendSort;
  /** "친구의 생일을 확인해 보세요" 펼침 목록 */
  upcomingBirthdays: UpcomingBirthday[];
  /** "2" */
  upcomingBirthdaysCountLabel: string;
};

export type FriendList = {
  /** "친구 3", "즐겨찾는 친구", "추천친구 3" */
  label: string;
  items: FriendSimple[];
};

export type NewsItem = {
  id: string;
  name: string;
  avatar: string;
  background: string;
  /** "오늘", "어제", "5월 16일" */
  updatedLabel: string;
};

export type FriendNews = {
  /** "업데이트한 친구 5" */
  label: string;
  items: NewsItem[];
};

export type MeProfile = {
  id: string;
  name: string;
  statusMessage: string;
  avatar: string;
};

export type FriendProfile = FriendSimple & {
  /** 배경 이미지 */
  background: string;
  /** 가입일 같은 보조 메타 */
  joinedAt: string;
};
