import { action, OnError } from "comwit";
import { toast } from "sonner";
import { order as orderAPI } from "@/demo/gamja-market/api/order";
import { order } from "../model";
import type { OrderActions } from "../types";

export const loadActions = action<
  Pick<OrderActions, "loadOrders" | "loadCurrent" | "refresh">
>(({ state }) => {
  class LoadActions {
    private model = state(order);

    async loadOrders() {
      await this.model.orders.query();
    }

    async refresh() {
      await this.model.orders.refetch();
    }

    @OnError((e: unknown) => {
      toast.error(
        e instanceof Error ? e.message : "주문을 불러오지 못했습니다",
      );
    })
    async loadCurrent(id: string) {
      const detail = await orderAPI.find(id);
      this.model.currentOrder = detail;
    }
  }
  return new LoadActions();
});
