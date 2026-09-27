import { model, query, keepPreviousData } from "comwit";
import { chat as chatAPI } from "@/demo/gamja-market/api/chat";
import type { ChatState } from "./types";

export const chat = model<ChatState>({
  chats: query<ChatState["chats"]["data"], void>({
    initialData: [],
    queryFn: () => chatAPI.findAll(),
    placeholderData: keepPreviousData,
  }),
});
