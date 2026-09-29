import type { Query } from "comwit";
import type {
  ChatDrawer,
  ChatMessage,
  ChatPhoto,
  ChatThreadDetail,
  ChatThreadSimple,
  ChatThreads,
  ThreadSearchResult,
} from "@/demo/kakao-talk/api/chat";

/** 채팅 목록 상단 필터 pill */
export type ThreadFilterKey = "all" | "unread";

export type ChatState = {
  threads: Query<ChatThreads, ThreadFilterKey>;
  /** 채팅 탭을 떠났다 돌아와도 고른 필터 유지 */
  threadFilter: ThreadFilterKey;
  threadSearch: Query<ThreadSearchResult, string>;
  currentThread: ChatThreadDetail | null;
};

export type ChatActions = {
  init(detail: ChatThreadDetail): void;
  loadThreads(): Promise<void>;
  setThreadFilter(filter: ThreadFilterKey): Promise<void>;
  searchThreads(q: string): Promise<void>;
  /** 현재 방에 내 메시지를 보낸다 */
  send(text: string): Promise<void>;
  /** 새 채팅 — 고른 대화상대의 방으로 이동 (피커는 history에서 교체) */
  openRoomWith(friendIds: string[]): Promise<void>;
};

export type {
  ChatDrawer,
  ChatMessage,
  ChatPhoto,
  ChatThreadDetail,
  ChatThreadSimple,
  ChatThreads,
  ThreadSearchResult,
};
