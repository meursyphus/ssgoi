"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/lib/components/ui/textarea";
import { useDemoBack } from "@/lib/hooks";
import { useReview } from "@/demo/gamja-market/state/review";
import type { OrderDetail } from "@/demo/gamja-market/state/order";
import { routes } from "@/demo/gamja-market/page/shared/routes";
import { RatingStars } from "./rating-stars";

const PLACEHOLDER = "상품의 맛, 신선도, 포장 상태 등 솔직한 후기를 들려주세요.";

export function ReviewForm({ order }: { order: OrderDetail }) {
  const review = useReview((state) => ({
    rating: state.rating,
    content: state.content,
    isSubmitting: state.isSubmitting,
    actions: state.actions,
  }));
  // Same dismissal as the header's X: back to wherever the sheet was opened.
  const close = useDemoBack(routes.order(order.id));

  const handleSubmit = async () => {
    try {
      const saved = await review.actions.submit({
        orderId: order.id,
        productId: order.productId,
      });
      if (saved) close();
    } catch {
      // The action already showed why (missing stars, too short).
    }
  };

  useEffect(() => {
    review.actions.reset();
    // Also clear on the way out (submit or close), so the next sheet never
    // mounts with this draft.
    return () => review.actions.reset();
  }, [order.id, review.actions]);

  return (
    <div className="flex flex-1 flex-col">
      <RatingStars rating={review.rating} onChange={review.actions.setRating} />

      <div className="mt-2 flex flex-1 flex-col bg-white px-4 py-5">
        <label className="text-[14px] font-bold text-gray-900">
          이 상품 어떠셨나요?
        </label>
        <Textarea
          value={review.content}
          onChange={(e) => review.actions.setContent(e.target.value)}
          placeholder={PLACEHOLDER}
          className="mt-2 min-h-[140px] resize-none rounded-lg border-gray-200 bg-white text-[13px] leading-relaxed text-gray-900 placeholder:text-gray-400"
          maxLength={500}
        />
        <p className="mt-1.5 self-end text-[11px] text-gray-400">
          {review.content.length} / 500
        </p>
      </div>

      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 pt-3 pb-[max(1.25rem,calc(var(--safe-bottom)+0.75rem))]">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={review.isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2db400] py-4 text-[15px] font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#25a000] disabled:opacity-70"
        >
          {review.isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          리뷰 등록하기
        </button>
      </div>
    </div>
  );
}
