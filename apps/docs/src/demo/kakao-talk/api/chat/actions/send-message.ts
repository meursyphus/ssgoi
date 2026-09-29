import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { ChatMessage } from "../types";

async function _sendMessage(
  threadId: string,
  text: string,
): Promise<ChatMessage> {
  const body = text.trim();
  if (!body) throw new ActionError("메시지를 입력해 주세요");
  if (!data.byId(threadId)) throw new ActionError("채팅방을 찾을 수 없습니다");
  return data.sentMessage(body, new Date());
}

export const sendMessage = createAction(_sendMessage);
