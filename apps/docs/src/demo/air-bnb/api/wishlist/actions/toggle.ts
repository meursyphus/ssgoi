import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { WishlistToggleResult } from "../types";

async function _toggle(listingId: string): Promise<WishlistToggleResult> {
  const saved = data.toggle(listingId);
  return {
    saved,
    message: saved ? `Saved to ${data.title}` : `Removed from ${data.title}`,
  };
}

export const toggle = createAction(_toggle);
