import { createAction } from "@/lib/utils";
import { data, toOrderSimple } from "../data";
import type { OrderSimple } from "../types";

async function _findAll(): Promise<OrderSimple[]> {
  return data.all().map(toOrderSimple);
}

export const findAll = createAction(_findAll);
