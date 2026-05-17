import { action } from "comwit";
import { pin } from "../model";
import type { PinActions } from "../types";

export const loadActions = action<Pick<PinActions, "loadPins">>(({ state }) => {
  class LoadActions {
    private model = state(pin);
    async loadPins() {
      await this.model.pins.query();
    }
  }
  return new LoadActions();
});
