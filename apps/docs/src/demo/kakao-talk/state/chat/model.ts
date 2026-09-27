import { model, query, keepPreviousData } from "comwit";
import { chat as chatAPI } from "@/demo/kakao-talk/api/chat";
import type { ChatState } from "./types";

export const chat = model<ChatState>({
  threads: query<ChatState["threads"]["data"], ChatState["threadFilter"]>({
    initialData: { pinned: [], recent: [] },
    queryFn: (filter) =>
      chatAPI.findThreads({ unreadOnly: filter === "unread" }),
    placeholderData: keepPreviousData,
  }),
  threadFilter: "all",
  threadSearch: query<ChatState["threadSearch"]["data"], string>({
    initialData: { label: "", items: [] },
    queryFn: (q) => chatAPI.searchThreads(q),
    placeholderData: keepPreviousData,
  }),
  currentThread: null,
});
