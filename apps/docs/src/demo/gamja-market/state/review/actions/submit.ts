import { action, OnError } from "comwit";
import { toast } from "sonner";
import type { AppContext } from "@/lib/state";
import { review as reviewAPI } from "@/demo/gamja-market/api/review";
import { order as orderAPI } from "@/demo/gamja-market/api/order";
import { order as orderModel } from "@/demo/gamja-market/state/order/model";
import { review } from "../model";
import type { ReviewActions } from "../types";

export const submitActions = action<Pick<ReviewActions, "submit">, AppContext>(
  ({ state, context }) => {
    class SubmitActions {
      private model = state(review);
      private orderModel = state(orderModel);

      @OnError((e: unknown) => {
        toast.error(
          e instanceof Error ? e.message : "리뷰 등록에 실패했습니다",
        );
      })
      async submit(input: { orderId: string; productId: string }) {
        if (this.model.isSubmitting) return;
        this.model.isSubmitting = true;
        try {
          await reviewAPI.create({
            orderId: input.orderId,
            productId: input.productId,
            rating: this.model.rating,
            content: this.model.content,
          });
          await orderAPI.markReviewWritten(input.orderId);
          await this.orderModel.orders.refetch();
          if (this.orderModel.currentOrder?.id === input.orderId) {
            this.orderModel.currentOrder.reviewWritten = true;
          }
          this.model.rating = 0;
          this.model.content = "";
          toast.success("리뷰가 등록되었어요");
          context.router.push(`/demo/gamja-market/orders/${input.orderId}`);
        } finally {
          this.model.isSubmitting = false;
        }
      }
    }
    return new SubmitActions();
  },
);
