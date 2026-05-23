import { model, query, keepPreviousData } from "comwit";
import { friend as friendAPI } from "@/demo/kakao-talk/api/friend";
import type { FriendState } from "./types";

export const friend = model<FriendState>({
  groups: query<FriendState["groups"]["data"], void>({
    initialData: {
      me: { id: "me", name: "", statusMessage: "", avatar: "" },
      birthday: [],
      favorites: [],
      friends: [],
      friendsCountLabel: "친구 0",
    },
    queryFn: () => friendAPI.findGroups(),
    placeholderData: keepPreviousData,
  }),
  currentProfile: null,
});
