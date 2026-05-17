import { action, silent } from "comwit";
import { friend } from "../model";
import type { FriendActions, FriendProfile } from "../types";

export const initActions = action<Pick<FriendActions, "init">>(({ state }) => {
  class InitActions {
    private model = state(friend);
    init(profile: FriendProfile) {
      silent(() => {
        this.model.currentProfile = profile;
      });
    }
  }
  return new InitActions();
});
