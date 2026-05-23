"use server";

import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { ChatThreads } from "../types";

async function _findThreads(): Promise<ChatThreads> {
  await new Promise((r) => setTimeout(r, 220));
  return {
    pinned: data.pinned(),
    recent: data.recent(),
  };
}

export const findThreads = createAction(_findThreads);
