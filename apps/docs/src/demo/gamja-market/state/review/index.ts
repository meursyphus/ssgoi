import { create } from "comwit";
import { review } from "./model";
import { editActions } from "./actions/edit";
import { submitActions } from "./actions/submit";
import type { ReviewState, ReviewActions } from "./types";

export * from "./types";

export const useReview = create<ReviewState, ReviewActions>(review, {
  actions: [editActions, submitActions],
});
