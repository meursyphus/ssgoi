import { action } from "comwit";
import { trip } from "../model";
import type { TripActions } from "../types";

export const loadActions = action<Pick<TripActions, "load">>(({ state }) => {
  class LoadActions {
    private model = state(trip);
    async load() {
      await this.model.trips.query();
    }
  }
  return new LoadActions();
});
