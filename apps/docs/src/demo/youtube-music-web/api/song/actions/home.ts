import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { HomeData } from "../types";

async function _home(): Promise<HomeData> {
  return data.home();
}

export const home = createAction(_home);
