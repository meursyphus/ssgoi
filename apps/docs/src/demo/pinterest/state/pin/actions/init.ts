import { action, silent } from "comwit";
import { pin } from "../model";
import type { PinActions, PinDetail } from "../types";

export const initActions = action<Pick<PinActions, "init">>(({ state }) => {
  class InitActions {
    private model = state(pin);
    init(detail: PinDetail) {
      silent(() => {
        this.model.currentPin = detail;
      });
    }
  }
  return new InitActions();
});
