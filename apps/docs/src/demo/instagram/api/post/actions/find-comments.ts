import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { PostComment } from "../types";

async function _findComments(id: string): Promise<PostComment[]> {
  const comments = data.comments(id);
  if (!comments) throw new ActionError("게시물을 찾을 수 없습니다");
  return comments;
}

export const findComments = createAction(_findComments);
