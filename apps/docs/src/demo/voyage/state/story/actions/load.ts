import { action } from "comwit";
import { story } from "../model";
import type { StoryActions } from "../types";

export const loadActions = action<Pick<StoryActions, "loadStories">>(
  ({ state }) => {
    class LoadActions {
      private model = state(story);
      async loadStories() {
        await this.model.stories.query();
      }
    }
    return new LoadActions();
  },
);
