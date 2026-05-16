import { action, OnError } from "comwit";
import { toast } from "sonner";
import type { AppContext } from "@/lib/state";
import { order as orderAPI } from "@/demo/gamja-market/api/order";
import { order as orderModel } from "@/demo/gamja-market/state/order/model";
import { cart } from "../model";
import type { CartActions, CartProductMeta } from "../types";

export const checkoutActions = action<
  Pick<CartActions, "checkout">,
  AppContext
>(({ state, context }) => {
  class CheckoutActions {
    private model = state(cart);
    private orderModel = state(orderModel);

    @OnError((e: unknown) => {
      toast.error(e instanceof Error ? e.message : "주문에 실패했습니다");
    })
    async checkout(metaList: CartProductMeta[]) {
      if (this.model.isCheckingOut) return;
      if (this.model.items.length === 0) return;

      this.model.isCheckingOut = true;
      try {
        const metaById = new Map(metaList.map((m) => [m.id, m]));
        const items = this.model.items.map((i) => ({ ...i }));
        const created = await Promise.all(
          items.map((i) => {
            const meta = metaById.get(i.productId);
            if (!meta) throw new Error("상품 정보를 찾을 수 없습니다");
            return orderAPI.create({
              productId: meta.id,
              productName: meta.name,
              thumbnail: meta.thumbnail,
              unitPrice: meta.price,
              pickupDate: meta.pickupDate,
              pickupPlace: meta.pickupPlace,
              quantity: i.quantity,
            });
          }),
        );

        this.model.items = [];
        await this.orderModel.orders.refetch();
        toast.success(`${created.length}건 주문이 완료되었어요`);
        context.router.push(`/demo/gamja-market/orders`);
      } finally {
        this.model.isCheckingOut = false;
      }
    }
  }
  return new CheckoutActions();
});
