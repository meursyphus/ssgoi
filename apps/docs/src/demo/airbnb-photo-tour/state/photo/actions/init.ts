import { action, silent } from "comwit";
import { photo } from "../model";
import type { PhotoActions, PhotoDetail, PhotoTour } from "../types";

export const initActions = action<
  Pick<PhotoActions, "initTour" | "initDetail">
>(({ state }) => {
  class InitActions {
    private model = state(photo);

    initTour(tour: PhotoTour) {
      silent(() => {
        this.model.tour.data = tour;
      });
    }

    initDetail(detail: PhotoDetail) {
      silent(() => {
        this.model.currentPhoto = detail;
      });
    }
  }
  return new InitActions();
});
