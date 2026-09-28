import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { FriendNews } from "../types";

async function _findNews(): Promise<FriendNews> {
  const items = data.news().map(({ profile, label }) => ({
    id: profile.id,
    name: profile.name,
    avatar: profile.avatar,
    background: profile.background,
    updatedLabel: label,
  }));
  return { label: `업데이트한 친구 ${items.length}`, items };
}

export const findNews = createAction(_findNews);
