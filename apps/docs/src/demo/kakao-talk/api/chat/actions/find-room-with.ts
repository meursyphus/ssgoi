import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";

async function _findRoomWith(friendIds: string[]): Promise<string> {
  const id = data.roomWith(friendIds);
  if (!id) throw new ActionError("대화상대를 선택해 주세요");
  return id;
}

export const findRoomWith = createAction(_findRoomWith);
