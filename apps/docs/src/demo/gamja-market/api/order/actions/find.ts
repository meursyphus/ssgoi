"use server";

import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { OrderDetail } from "../types";

async function _find(id: string): Promise<OrderDetail> {
  await new Promise((r) => setTimeout(r, 220));
  const order = data.byId(id);
  if (!order) throw new ActionError("주문 내역을 찾을 수 없습니다");
  return order;
}

export const find = createAction(_find);
