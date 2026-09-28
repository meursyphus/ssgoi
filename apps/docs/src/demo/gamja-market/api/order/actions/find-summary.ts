import { createAction } from "@/lib/utils";
import { data, toOrderSimple } from "../data";
import type { OrderSummary } from "../types";

const RECENT_LIMIT = 2;

async function _findSummary(): Promise<OrderSummary> {
  const all = data.all();
  // Seed and new orders are kept newest first; review the oldest one first.
  const reviewable = all.filter(
    (o) => o.status === "picked_up" && !o.reviewWritten,
  );
  return {
    totalCount: all.length,
    readyCount: all.filter((o) => o.status === "ready").length,
    reviewableOrderId: reviewable.at(-1)?.id ?? null,
    reviewableCount: reviewable.length,
    recent: all.slice(0, RECENT_LIMIT).map(toOrderSimple),
  };
}

export const findSummary = createAction(_findSummary);
