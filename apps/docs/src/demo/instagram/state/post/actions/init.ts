import { action, silent } from "comwit";
import { post } from "../model";
import type { PostActions, PostDetail, ReelDetail } from "../types";

export const initActions = action<Pick<PostActions, "init" | "initReel">>(
  ({ state }) => {
    class InitActions {
      private model = state(post);
      init(detail: PostDetail) {
        silent(() => {
          this.model.currentPost = detail;
        });
      }
      initReel(detail: ReelDetail) {
        silent(() => {
          this.model.currentReel = detail;
        });
      }
    }
    return new InitActions();
  },
);
