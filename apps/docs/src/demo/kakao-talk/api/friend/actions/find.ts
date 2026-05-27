import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { FriendProfile } from "../types";

async function _find(id: string): Promise<FriendProfile> {
  const profile = data.byId(id);
  if (!profile) throw new ActionError("프로필을 찾을 수 없습니다");
  return profile;
}

export const find = createAction(_find);
