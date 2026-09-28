import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { Follows } from "../types";

async function _findFollows(): Promise<Follows> {
  return data.follows();
}

export const findFollows = createAction(_findFollows);
