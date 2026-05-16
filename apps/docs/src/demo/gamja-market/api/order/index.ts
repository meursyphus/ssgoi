import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findAll } from "./actions/find-all";
import { find } from "./actions/find";
import { create } from "./actions/create";
import { markReviewWritten } from "./actions/mark-review-written";

export const order = resolveActions({
  findAll,
  find,
  create,
  markReviewWritten,
});
