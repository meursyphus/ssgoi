import { create } from "comwit";
import { post } from "./model";
import { initActions } from "./actions/init";
import { loadActions } from "./actions/load";
import type { PostState, PostActions } from "./types";

export * from "./types";

export const usePost = create<PostState, PostActions>(post, {
  actions: [initActions, loadActions],
});
