export interface ReviewAPI {
  create: (input: CreateReviewInput) => Promise<Review>;
}

export type CreateReviewInput = {
  orderId: string;
  productId: string;
  rating: number;
  content: string;
};

export type Review = {
  id: string;
  orderId: string;
  productId: string;
  rating: number;
  content: string;
  createdAt: string;
};
