import { action } from "comwit";
import { photo } from "../model";
import type { PhotoActions } from "../types";

export const loadActions = action<Pick<PhotoActions, "loadAll">>(({ state }) => {
  class LoadActions {
    private model = state(photo);
    async loadAll() {
      await this.model.photos.query();
    }
  }
  return new LoadActions();
});
