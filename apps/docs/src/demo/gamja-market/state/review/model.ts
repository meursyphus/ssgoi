import { model } from "comwit";
import type { ReviewState } from "./types";

export const review = model<ReviewState>({
  rating: 0,
  content: "",
  isSubmitting: false,
});
