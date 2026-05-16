import type { CreateReviewInput, Review } from "@/demo/gamja-market/api/review";

export type ReviewState = {
  rating: number;
  content: string;
  isSubmitting: boolean;
};

export type ReviewActions = {
  setRating(rating: number): void;
  setContent(content: string): void;
  reset(): void;
  submit(input: { orderId: string; productId: string }): Promise<void>;
};

export type { CreateReviewInput, Review };
