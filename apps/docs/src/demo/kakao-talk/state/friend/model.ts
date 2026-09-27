import { model, query, keepPreviousData } from "comwit";
import { friend as friendAPI } from "@/demo/kakao-talk/api/friend";
import type { FriendState } from "./types";

const emptyList = { label: "", items: [] };

export const friend = model<FriendState>({
  groups: query<FriendState["groups"]["data"], FriendState["friendSort"]>({
    initialData: {
      me: { id: "me", name: "", statusMessage: "", avatar: "" },
      birthday: [],
      favorites: [],
      friends: [],
      friendsCountLabel: "친구 0",
      sort: "name",
      upcomingBirthdays: [],
      upcomingBirthdaysCountLabel: "0",
    },
    queryFn: (sort) => friendAPI.findGroups({ sort }),
    placeholderData: keepPreviousData,
  }),
  friendSort: "name",
  homeSegment: "friends",
  news: query<FriendState["news"]["data"], void>({
    initialData: emptyList,
    queryFn: () => friendAPI.findNews(),
  }),
  searchResult: query<FriendState["searchResult"]["data"], string>({
    initialData: emptyList,
    queryFn: (q) => friendAPI.search(q),
    placeholderData: keepPreviousData,
  }),
  searchText: "",
  recommended: query<FriendState["recommended"]["data"], string>({
    initialData: emptyList,
    queryFn: (q) => friendAPI.findRecommended(q),
    placeholderData: keepPreviousData,
  }),
  pickable: query<FriendState["pickable"]["data"], void>({
    initialData: emptyList,
    queryFn: () => friendAPI.findPickable(),
  }),
  addedIds: [],
  currentProfile: null,
});
