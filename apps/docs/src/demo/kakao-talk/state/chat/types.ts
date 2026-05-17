import type { Query } from "comwit";
import type { ChatThreads, ChatThreadDetail } from "@/demo/kakao-talk/api/chat";

export type ChatState = {
  threads: Query<ChatThreads, void>;
  currentThread: ChatThreadDetail | null;
};

export type ChatActions = {
  init(detail: ChatThreadDetail): void;
  loadThreads(): Promise<void>;
};

export type { ChatThreads, ChatThreadDetail };
