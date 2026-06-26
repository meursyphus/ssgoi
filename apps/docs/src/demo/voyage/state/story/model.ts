import { model, query, keepPreviousData } from "comwit";
import { story as storyAPI } from "@/demo/voyage/api/story";
import type { StoryState } from "./types";

export const story = model<StoryState>({
  stories: query<StoryState["stories"]["data"], void>({
    initialData: [],
    queryFn: () => storyAPI.findAll(),
    placeholderData: keepPreviousData,
  }),
});
