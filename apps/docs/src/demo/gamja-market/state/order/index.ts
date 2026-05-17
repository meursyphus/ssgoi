import { create } from "comwit";
import { order } from "./model";
import { initActions } from "./actions/init";
import { loadActions } from "./actions/load";
import { crudActions } from "./actions/crud";
import type { OrderState, OrderActions } from "./types";

export * from "./types";

export const useOrder = create<OrderState, OrderActions>(order, {
  actions: [initActions, loadActions, crudActions],
});
