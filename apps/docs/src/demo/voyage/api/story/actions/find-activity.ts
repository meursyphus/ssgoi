import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { ActivitySection } from "../types";

async function _findActivity(): Promise<ActivitySection[]> {
  return data.activity();
}

export const findActivity = createAction(_findActivity);
