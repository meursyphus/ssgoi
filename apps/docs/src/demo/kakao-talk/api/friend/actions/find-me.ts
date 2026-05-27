import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { MeProfile } from "../types";

async function _findMe(): Promise<MeProfile> {
  return data.me();
}

export const findMe = createAction(_findMe);
