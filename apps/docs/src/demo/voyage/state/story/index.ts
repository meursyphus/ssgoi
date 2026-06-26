import { create } from "comwit";
import { story } from "./model";
import { loadActions } from "./actions/load";
import type { StoryState, StoryActions } from "./types";

export * from "./types";

export const useStory = create<StoryState, StoryActions>(story, {
  actions: [loadActions],
});
