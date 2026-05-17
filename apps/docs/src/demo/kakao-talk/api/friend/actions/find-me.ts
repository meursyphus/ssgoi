"use server";

import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { MeProfile } from "../types";

async function _findMe(): Promise<MeProfile> {
  await new Promise((r) => setTimeout(r, 120));
  return data.me();
}

export const findMe = createAction(_findMe);
