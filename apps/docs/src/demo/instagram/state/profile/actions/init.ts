import { action, silent } from "comwit";
import { profile } from "../model";
import type { Follows, ProfileActions, StoryDetail } from "../types";

export const initActions = action<
  Pick<ProfileActions, "initStory" | "initFollows">
>(({ state }) => {
  class InitActions {
    private model = state(profile);
    initStory(detail: StoryDetail) {
      silent(() => {
        this.model.currentStory = detail;
      });
    }
    initFollows(follows: Follows) {
      silent(() => {
        this.model.currentFollows = follows;
      });
    }
  }
  return new InitActions();
});
