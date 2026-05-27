import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { Reel } from "../types";

async function _findReels(): Promise<Reel[]> {
  return data.reels();
}

export const findReels = createAction(_findReels);
