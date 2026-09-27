import type { Query } from "comwit";
import type {
  FriendGroups,
  FriendList,
  FriendNews,
  FriendProfile,
  FriendSimple,
  FriendSort,
  MeProfile,
  NewsItem,
  UpcomingBirthday,
} from "@/demo/kakao-talk/api/friend";

/** 친구 탭 상단 pill — 친구 목록 / 소식 */
export type HomeSegment = "friends" | "news";

export type FriendState = {
  groups: Query<FriendGroups, FriendSort>;
  /** 친구 목록 정렬 — 가나다순 / 업데이트순 */
  friendSort: FriendSort;
  /** 프로필을 열었다 돌아와도 보던 pill 유지 */
  homeSegment: HomeSegment;
  news: Query<FriendNews, void>;
  searchResult: Query<FriendList, string>;
  /** 검색어 — 결과(프로필·채팅방)에 들어갔다 돌아와도 유지 */
  searchText: string;
  recommended: Query<FriendList, string>;
  pickable: Query<FriendList, void>;
  /** 친구 추가 화면에서 '추가'를 누른 추천친구 */
  addedIds: string[];
  currentProfile: FriendProfile | null;
};

export type FriendActions = {
  init(profile: FriendProfile): void;
  loadGroups(): Promise<void>;
  setSort(sort: FriendSort): Promise<void>;
  setSegment(segment: HomeSegment): Promise<void>;
  loadNews(): Promise<void>;
  search(q: string): Promise<void>;
  setSearchText(q: string): void;
  loadRecommended(q: string): Promise<void>;
  loadPickable(): Promise<void>;
  toggleAdded(id: string): void;
};

export type {
  FriendGroups,
  FriendList,
  FriendNews,
  FriendProfile,
  FriendSimple,
  FriendSort,
  MeProfile,
  NewsItem,
  UpcomingBirthday,
};
