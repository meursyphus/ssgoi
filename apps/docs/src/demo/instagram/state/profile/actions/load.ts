import { action } from "comwit";
import { profile } from "../model";
import type { ProfileActions } from "../types";

export const loadActions = action<
  Pick<ProfileActions, "loadMe" | "loadStoryTray">
>(({ state }) => {
  class LoadActions {
    private model = state(profile);
    async loadMe() {
      await this.model.me.query();
    }
    async loadStoryTray() {
      await this.model.storyTray.query();
    }
  }
  return new LoadActions();
});
