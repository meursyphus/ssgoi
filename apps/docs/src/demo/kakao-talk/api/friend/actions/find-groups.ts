import { createAction } from "@/lib/utils";
import { data, toSimple } from "../data";
import type { FriendGroups, FriendGroupsFilter, FriendSimple } from "../types";

async function _findGroups(filter?: FriendGroupsFilter): Promise<FriendGroups> {
  const sort = filter?.sort ?? "name";
  const me = data.me();

  const birthdaySet = new Set(data.birthdayIds);
  const favoriteSet = new Set(data.favoriteIds);

  const birthday: FriendSimple[] = [];
  const favorites: FriendSimple[] = [];
  const rest = [];

  for (const profile of data.all()) {
    if (birthdaySet.has(profile.id)) birthday.push(toSimple(profile));
    else if (favoriteSet.has(profile.id)) favorites.push(toSimple(profile));
    else rest.push(profile);
  }

  const ordered =
    sort === "updated" ? data.sortedByUpdate(rest) : data.sortedByName(rest);
  const upcoming = data.upcomingBirthdays();

  return {
    me,
    birthday,
    favorites,
    friends: ordered.map(toSimple),
    friendsCountLabel: `친구 ${ordered.length}`,
    sort,
    upcomingBirthdays: upcoming.map(({ profile, dateLabel }) => ({
      friend: toSimple(profile),
      dateLabel,
    })),
    upcomingBirthdaysCountLabel: String(upcoming.length),
  };
}

export const findGroups = createAction(_findGroups);
