import { action, OnError } from "comwit";
import { toast } from "sonner";
import type { AppContext } from "@/lib/state";
import { order as orderAPI } from "@/demo/gamja-market/api/order";
import { chat as chatModel } from "@/demo/gamja-market/state/chat/model";
import { order } from "../model";
import type { OrderActions, OrderDetail } from "../types";

export const crudActions = action<Pick<OrderActions, "create">, AppContext>(
  ({ state, context }) => {
    class CrudActions {
      private model = state(order);
      private chatModel = state(chatModel);

      @OnError((e: unknown) => {
        toast.error(e instanceof Error ? e.message : "주문에 실패했습니다");
      })
      async create(
        input: Parameters<OrderActions["create"]>[0],
      ): Promise<OrderDetail> {
        const created = await orderAPI.create(input);
        // Only this browser's mock knows the new order; the detail route reads it from here.
        this.model.sessionOrders[created.id] = created;
        this.model.currentOrder = created;
        await Promise.all([
          this.model.orders.refetch(),
          this.model.summary.refetch(),
          this.chatModel.chats.refetch(),
        ]);
        toast.success("주문이 완료되었어요");
        context.router.push(`/demo/gamja-market/orders/${created.id}`);
        return created;
      }
    }
    return new CrudActions();
  },
);
