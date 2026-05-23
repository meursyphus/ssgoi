import { action, silent } from "comwit";
import { photo } from "../model";
import type { PhotoActions, PhotoDetail } from "../types";

export const initActions = action<Pick<PhotoActions, "init">>(({ state }) => {
  class InitActions {
    private model = state(photo);
    init(detail: PhotoDetail) {
      silent(() => {
        this.model.currentPhoto = detail;
      });
    }
  }
  return new InitActions();
});
