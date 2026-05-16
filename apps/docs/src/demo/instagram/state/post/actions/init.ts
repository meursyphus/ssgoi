import { action, silent } from "comwit";
import { post } from "../model";
import type { PostActions, PostDetail } from "../types";

export const initActions = action<Pick<PostActions, "init">>(({ state }) => {
  class InitActions {
    private model = state(post);
    init(detail: PostDetail) {
      silent(() => {
        this.model.currentPost = detail;
      });
    }
  }
  return new InitActions();
});
