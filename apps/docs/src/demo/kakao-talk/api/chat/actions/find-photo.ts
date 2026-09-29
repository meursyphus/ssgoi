import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { ChatPhoto } from "../types";

async function _findPhoto(
  threadId: string,
  messageId: string,
): Promise<ChatPhoto> {
  const photo = data.photo(threadId, messageId);
  if (!photo) throw new ActionError("사진을 찾을 수 없습니다");
  return photo;
}

export const findPhoto = createAction(_findPhoto);
