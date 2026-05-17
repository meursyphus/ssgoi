"use server";

import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { PostDetail } from "../types";

async function _find(id: string): Promise<PostDetail> {
  await new Promise((r) => setTimeout(r, 180));
  const post = data.byId(id);
  if (!post) throw new ActionError("게시물을 찾을 수 없습니다");
  return post;
}

export const find = createAction(_find);
