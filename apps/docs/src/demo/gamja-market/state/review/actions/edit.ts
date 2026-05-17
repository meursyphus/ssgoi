import { action } from "comwit";
import { review } from "../model";
import type { ReviewActions } from "../types";

export const editActions = action<
  Pick<ReviewActions, "setRating" | "setContent" | "reset">
>(({ state }) => {
  class EditActions {
    private model = state(review);

    setRating(rating: number) {
      this.model.rating = rating;
    }

    setContent(content: string) {
      this.model.content = content;
    }

    reset() {
      this.model.rating = 0;
      this.model.content = "";
      this.model.isSubmitting = false;
    }
  }
  return new EditActions();
});
