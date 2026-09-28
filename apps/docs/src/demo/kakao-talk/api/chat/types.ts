export interface ChatAPI {
  /** 채팅 목록 — 핀+일반이 이미 분리되어 옴. unreadOnly면 안 읽은 방만 */
  findThreads: (filter?: ThreadFilter) => Promise<ChatThreads>;
  /** 채팅방 상세 — 메시지 히스토리 포함 */
  findThread: (id: string) => Promise<ChatThreadDetail>;
  /** 채팅방 검색 (방 이름·마지막 메시지). 빈 검색어면 최근 대화 */
  searchThreads: (q: string) => Promise<ThreadSearchResult>;
  /** 채팅방 서랍 — 사진 모음 + 대화상대 */
  findDrawer: (id: string) => Promise<ChatDrawer>;
  /** 사진 메시지 뷰어 */
  findPhoto: (threadId: string, messageId: string) => Promise<ChatPhoto>;
  /** 친구와의 1:1 채팅방 id (없으면 빈 방 dm-<friendId>) */
  findDmThreadId: (friendId: string) => Promise<string>;
  /** 새 채팅 — 고른 대화상대로 들어갈 방 id */
  findRoomWith: (friendIds: string[]) => Promise<string>;
  /** 메시지 보내기 — 방에 추가된 메시지를 돌려줌 */
  sendMessage: (threadId: string, text: string) => Promise<ChatMessage>;
}

export type ThreadFilter = {
  unreadOnly?: boolean;
};

export type ChatThreadSimple = {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  lastMessage: string;
  /** "오후 2:13", "어제", "5/15" 등 */
  lastMessageAt: string;
  unreadCount: number;
  /** 1:1이 아닌 그룹방 표시용 */
  memberCount?: number;
  pinned?: boolean;
  muted?: boolean;
  /** 1:1 방 상대의 프로필 id — 목록 아바타 탭용 (그룹방은 없음) */
  profileId?: string;
};

export type ChatThreads = {
  pinned: ChatThreadSimple[];
  recent: ChatThreadSimple[];
};

export type ThreadSearchResult = {
  /** "채팅방 2" 또는 빈 검색어일 때 "최근 대화" */
  label: string;
  items: ChatThreadSimple[];
};

export type ChatMessage = {
  id: string;
  /** "me" = 내가 보낸 메시지, "system" = 방 안내 문구 (초대 등) */
  senderId: "me" | "system" | string;
  /** 비-me 메시지의 발신자 이름 (그룹방 등) */
  senderName?: string;
  /** 비-me 메시지의 아바타 */
  senderAvatar?: string;
  text: string;
  /** "오후 2:13" */
  sentAt: string;
  /** 이미지 메시지일 경우 */
  imageUrl?: string;
  /** 연속 발화의 시작 — 아바타/이름 표시 (API에서 계산) */
  showSenderInfo?: boolean;
  /** 이 메시지 위에 표시할 날짜 디바이더 (API에서 계산) */
  dateDividerLabel?: string;
  /** "1" (안읽음 수) 같은 표시 */
  readIndicator?: string;
};

export type ChatThreadDetail = ChatThreadSimple & {
  /** 친구 ID (프로필로 점프할 때 사용) */
  friendId: string;
  /** 오래된 순 정렬된 메시지 목록 — 이미 정렬해서 옴 */
  messages: ChatMessage[];
};

export type ChatMember = {
  id: string;
  name: string;
  avatar: string;
  isMe: boolean;
};

export type ChatDrawer = {
  id: string;
  partnerName: string;
  muted: boolean;
  pinned: boolean;
  /** 사진 메시지 — 최신 순 */
  photos: { id: string; imageUrl: string }[];
  /** "사진·동영상 1" */
  photosLabel: string;
  /** 나 먼저, 그다음 대화상대 */
  members: ChatMember[];
  /** "대화상대 4" */
  membersLabel: string;
};

export type ChatPhoto = {
  threadId: string;
  messageId: string;
  imageUrl: string;
  /** "나" 또는 보낸 친구 이름 */
  senderName: string;
  sentAt: string;
};
