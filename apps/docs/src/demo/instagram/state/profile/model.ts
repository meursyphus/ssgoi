import { model, query, keepPreviousData } from "comwit";
import { profile as profileAPI } from "@/demo/instagram/api/profile";
import type { ProfileState } from "./types";

export const profile = model<ProfileState>({
  me: query<ProfileState["me"]["data"], void>({
    initialData: null,
    queryFn: () => profileAPI.getMe(),
  }),
  storyTray: query<ProfileState["storyTray"]["data"], void>({
    initialData: [],
    queryFn: () => profileAPI.findStoryTray(),
    placeholderData: keepPreviousData,
  }),
  currentStory: null,
  currentFollows: null,
});
