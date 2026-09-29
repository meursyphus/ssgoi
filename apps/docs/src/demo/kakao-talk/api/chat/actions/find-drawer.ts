import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { ChatDrawer } from "../types";

async function _findDrawer(id: string): Promise<ChatDrawer> {
  const drawer = data.drawer(id);
  if (!drawer) throw new ActionError("채팅방을 찾을 수 없습니다");
  return drawer;
}

export const findDrawer = createAction(_findDrawer);
