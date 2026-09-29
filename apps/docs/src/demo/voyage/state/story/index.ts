import { create } from "comwit";
import { story } from "./model";
import { initActions } from "./actions/init";
import { loadActions } from "./actions/load";
import { interactActions } from "./actions/interact";
import type { StoryState, StoryActions } from "./types";

export * from "./types";

export const useStory = create<StoryState, StoryActions>(story, {
  actions: [initActions, loadActions, interactActions],
});
