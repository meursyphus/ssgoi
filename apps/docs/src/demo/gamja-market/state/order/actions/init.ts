import { action, silent } from "comwit";
import { order } from "../model";
import type { OrderActions, OrderDetail } from "../types";

export const initActions = action<Pick<OrderActions, "init">>(({ state }) => {
  class InitActions {
    private model = state(order);
    init(detail: OrderDetail) {
      silent(() => {
        this.model.currentOrder = detail;
      });
    }
  }
  return new InitActions();
});
