"use server";

import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { ProfileMe } from "../types";

async function _getMe(): Promise<ProfileMe> {
  await new Promise((r) => setTimeout(r, 180));
  return data.getMe();
}

export const getMe = createAction(_getMe);
