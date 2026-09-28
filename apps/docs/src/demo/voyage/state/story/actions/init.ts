import { action, silent } from "comwit";
import { story } from "../model";
import type { StoryActions, StoryDetail, StorySimple } from "../types";

export const initActions = action<
  Pick<StoryActions, "initFeed" | "initSaved" | "init">
>(({ state }) => {
  class InitActions {
    private model = state(story);

    initFeed(stories: StorySimple[]) {
      if (this.model.stories.isSuccess) return;
      silent(() => {
        this.model.stories.set(stories);
      });
    }

    initSaved(stories: StorySimple[]) {
      if (this.model.savedStories.isSuccess) return;
      silent(() => {
        this.model.savedStories.set(stories);
      });
    }

    init(detail: StoryDetail) {
      if (this.model.current?.id === detail.id) return;
      // Server data knows nothing about bookmarks toggled in this session;
      // every toggle refetches the feed, so the feed row is the truth.
      const known = this.model.stories.data.find((s) => s.id === detail.id);
      silent(() => {
        this.model.current = known ? { ...detail, saved: known.saved } : detail;
      });
    }
  }
  return new InitActions();
});
