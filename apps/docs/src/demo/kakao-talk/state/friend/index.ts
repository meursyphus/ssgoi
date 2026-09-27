import { create } from "comwit";
import { friend } from "./model";
import { initActions } from "./actions/init";
import { loadActions } from "./actions/load";
import { interactActions } from "./actions/interact";
import type { FriendState, FriendActions } from "./types";

export * from "./types";

export const useFriend = create<FriendState, FriendActions>(friend, {
  actions: [initActions, loadActions, interactActions],
});
