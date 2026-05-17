import { model, query, keepPreviousData } from "comwit";
import { chat as chatAPI } from "@/demo/kakao-talk/api/chat";
import type { ChatState } from "./types";

export const chat = model<ChatState>({
  threads: query<ChatState["threads"]["data"], void>({
    initialData: { pinned: [], recent: [] },
    queryFn: () => chatAPI.findThreads(),
    placeholderData: keepPreviousData,
  }),
  currentThread: null,
});
