export interface ChatAPI {
  /** 채팅 목록 — 핀+일반이 이미 분리되어 옴 */
  findThreads: () => Promise<ChatThreads>;
  /** 채팅방 상세 — 메시지 히스토리 포함 */
  findThread: (id: string) => Promise<ChatThreadDetail>;
}

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
};

export type ChatThreads = {
  pinned: ChatThreadSimple[];
  recent: ChatThreadSimple[];
};

export type ChatMessage = {
  id: string;
  /** "me" = 내가 보낸 메시지 */
  senderId: "me" | string;
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
