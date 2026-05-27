import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { ProfileMe } from "../types";

async function _getMe(): Promise<ProfileMe> {
  return data.getMe();
}

export const getMe = createAction(_getMe);
