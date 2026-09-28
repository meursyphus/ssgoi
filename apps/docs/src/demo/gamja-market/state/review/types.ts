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
  /**
   * Saves the review. Resolves true once it is stored (false when a submit is
   * already in flight); rejects with a toast on validation errors. The sheet
   * dismisses itself on success.
   */
  submit(input: { orderId: string; productId: string }): Promise<boolean>;
};

export type { CreateReviewInput, Review };
