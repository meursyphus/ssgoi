import type { Review } from "./types";

const reviews: Review[] = [];
let counter = 1;

export const data = {
  all: () => reviews.map((r) => ({ ...r })),
  create: (input: Omit<Review, "id" | "createdAt">): Review => {
    const id = `r-${String(counter++).padStart(3, "0")}`;
    const next: Review = {
      ...input,
      id,
      createdAt: new Date().toISOString(),
    };
    reviews.push(next);
    return { ...next };
  },
};
