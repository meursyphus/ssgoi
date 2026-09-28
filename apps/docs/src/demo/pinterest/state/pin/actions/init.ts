import { action, silent } from "comwit";
import { pin } from "../model";
import type { PinActions, PinDetail, PinSimple } from "../types";

export const initActions = action<
  Pick<PinActions, "init" | "initFeed" | "initSaved">
>(({ state }) => {
  class InitActions {
    private model = state(pin);
    init(detail: PinDetail) {
      silent(() => {
        this.model.currentPin = detail;
      });
    }
    initFeed(pins: PinSimple[]) {
      if (this.model.pins.isSuccess) return;
      silent(() => {
        this.model.pins.set(pins);
      });
    }
    initSaved(pins: PinSimple[]) {
      if (this.model.saved.isSuccess) return;
      silent(() => {
        this.model.saved.set(pins);
      });
    }
  }
  return new InitActions();
});
