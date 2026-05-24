import { action } from "comwit";
import { photo } from "../model";
import type { PhotoActions } from "../types";

export const loadActions = action<Pick<PhotoActions, "loadTour">>(
  ({ state }) => {
    class LoadActions {
      private model = state(photo);
      async loadTour() {
        await this.model.tour.query();
      }
    }
    return new LoadActions();
  },
);
