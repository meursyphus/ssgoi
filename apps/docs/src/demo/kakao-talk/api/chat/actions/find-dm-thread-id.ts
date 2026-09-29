import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";

async function _findDmThreadId(friendId: string): Promise<string> {
  const id = data.dmThreadIdFor(friendId);
  if (!id) throw new ActionError("대화상대를 찾을 수 없습니다");
  return id;
}

export const findDmThreadId = createAction(_findDmThreadId);
