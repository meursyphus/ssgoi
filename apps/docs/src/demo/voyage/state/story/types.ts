import type { Query } from "comwit";
import type { StorySimple } from "@/demo/voyage/api/story";

export type StoryState = {
  stories: Query<StorySimple[], void>;
};

export type StoryActions = {
  loadStories(): Promise<void>;
};

export type { StorySimple };
