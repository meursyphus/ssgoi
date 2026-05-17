"use server";

import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { HomeData } from "../types";

async function _home(): Promise<HomeData> {
  await new Promise((r) => setTimeout(r, 180));
  return data.home();
}

export const home = createAction(_home);
