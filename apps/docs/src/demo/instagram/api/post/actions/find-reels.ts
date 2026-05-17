"use server";

import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { Reel } from "../types";

async function _findReels(): Promise<Reel[]> {
  await new Promise((r) => setTimeout(r, 220));
  return data.reels();
}

export const findReels = createAction(_findReels);
