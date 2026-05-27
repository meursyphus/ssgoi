import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { FriendGroups, FriendSimple } from "../types";

function toSimple(profile: ReturnType<typeof data.byId>): FriendSimple | null {
  if (!profile) return null;
  const { background, joinedAt, ...rest } = profile;
  void background;
  void joinedAt;
  return rest;
}

async function _findGroups(): Promise<FriendGroups> {
  const all = data.all();
  const me = data.me();

  const birthdaySet = new Set(data.birthdayIds);
  const favoriteSet = new Set(data.favoriteIds);

  const birthday: FriendSimple[] = [];
  const favorites: FriendSimple[] = [];
  const friends: FriendSimple[] = [];

  for (const profile of all) {
    const simple = toSimple(profile);
    if (!simple) continue;
    if (birthdaySet.has(profile.id)) birthday.push(simple);
    else if (favoriteSet.has(profile.id)) favorites.push(simple);
    else friends.push(simple);
  }

  return {
    me,
    birthday,
    favorites,
    friends,
    friendsCountLabel: `친구 ${friends.length}`,
  };
}

export const findGroups = createAction(_findGroups);
