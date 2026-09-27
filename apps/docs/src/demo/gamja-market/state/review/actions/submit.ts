import { action, OnError } from "comwit";
import { toast } from "sonner";
import { review as reviewAPI } from "@/demo/gamja-market/api/review";
import { order as orderAPI } from "@/demo/gamja-market/api/order";
import { order as orderModel } from "@/demo/gamja-market/state/order/model";
import { chat as chatModel } from "@/demo/gamja-market/state/chat/model";
import { review } from "../model";
import type { ReviewActions } from "../types";

export const submitActions = action<Pick<ReviewActions, "submit">>(
  ({ state }) => {
    class SubmitActions {
      private model = state(review);
      private orderModel = state(orderModel);
      private chatModel = state(chatModel);

      @OnError((e: unknown) => {
        toast.error(
          e instanceof Error ? e.message : "리뷰 등록에 실패했습니다",
        );
      })
      async submit(input: { orderId: string; productId: string }) {
        if (this.model.isSubmitting) return false;
        this.model.isSubmitting = true;
        try {
          await reviewAPI.create({
            orderId: input.orderId,
            productId: input.productId,
            rating: this.model.rating,
            content: this.model.content,
          });
          await orderAPI.markReviewWritten(input.orderId);
          // Keep the reviewed copy: the order page underneath the sheet may be
          // restored from a cached server payload that still says "not reviewed".
          const reviewed = await orderAPI.find(input.orderId);
          this.orderModel.sessionOrders[input.orderId] = reviewed;
          if (this.orderModel.currentOrder?.id === input.orderId) {
            this.orderModel.currentOrder = reviewed;
          }
          await Promise.all([
            this.orderModel.orders.refetch(),
            this.orderModel.summary.refetch(),
            this.chatModel.chats.refetch(),
          ]);
          // The form clears itself when the sheet unmounts, so the leaving
          // sheet keeps its stars while it slides down.
          toast.success("리뷰가 등록되었어요");
          return true;
        } finally {
          this.model.isSubmitting = false;
        }
      }
    }
    return new SubmitActions();
  },
);
