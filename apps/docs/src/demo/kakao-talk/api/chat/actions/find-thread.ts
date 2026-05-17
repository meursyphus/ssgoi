"use server";

import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { ChatThreadDetail } from "../types";

async function _findThread(id: string): Promise<ChatThreadDetail> {
  await new Promise((r) => setTimeout(r, 220));
  const thread = data.byId(id);
  if (!thread) throw new ActionError("채팅방을 찾을 수 없습니다");
  return thread;
}

export const findThread = createAction(_findThread);
