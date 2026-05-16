"use server";

import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { CreateReviewInput, Review } from "../types";

async function _create(input: CreateReviewInput): Promise<Review> {
  await new Promise((r) => setTimeout(r, 360));
  if (input.rating < 1 || input.rating > 5) {
    throw new ActionError("별점을 선택해 주세요");
  }
  if (input.content.trim().length < 5) {
    throw new ActionError("리뷰 내용을 5자 이상 입력해 주세요");
  }
  return data.create({
    orderId: input.orderId,
    productId: input.productId,
    rating: input.rating,
    content: input.content.trim(),
  });
}

export const create = createAction(_create);
