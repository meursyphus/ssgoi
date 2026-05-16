import { action } from "comwit";
import { post } from "../model";
import type { PostActions } from "../types";

export const loadActions = action<
  Pick<PostActions, "loadPosts" | "loadReels" | "loadTagged">
>(({ state }) => {
  class LoadActions {
    private model = state(post);
    async loadPosts() {
      await this.model.posts.query();
    }
    async loadReels() {
      await this.model.reels.query();
    }
    async loadTagged() {
      await this.model.tagged.query();
    }
  }
  return new LoadActions();
});
