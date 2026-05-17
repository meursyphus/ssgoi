export interface FriendAPI {
  /** 즐겨찾기/생일/일반 친구를 묶어서 반환 */
  findGroups: () => Promise<FriendGroups>;
  /** 프로필 상세 */
  find: (id: string) => Promise<FriendProfile>;
  /** 내 프로필 (상단 카드) */
  findMe: () => Promise<MeProfile>;
}

export type FriendSimple = {
  id: string;
  name: string;
  /** 상태 메시지 */
  statusMessage: string;
  avatar: string;
  /** 음악 카드 등 추가 표시용 */
  music?: { title: string; artist: string };
};

export type FriendGroups = {
  me: MeProfile;
  birthday: FriendSimple[];
  favorites: FriendSimple[];
  friends: FriendSimple[];
  /** "친구 24" */
  friendsCountLabel: string;
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
