import { action, silent } from "comwit";
import { order } from "../model";
import type { OrderActions, OrderDetail } from "../types";

export const initActions = action<Pick<OrderActions, "init">>(({ state }) => {
  class InitActions {
    private model = state(order);
    init(detail: OrderDetail) {
      silent(() => {
        // A copy changed in this session (placed, reviewed) is newer than the
        // server-rendered one — Back can also hand us a cached, stale payload.
        this.model.currentOrder = this.model.sessionOrders[detail.id] ?? detail;
      });
    }
  }
  return new InitActions();
});
