"use server";

import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { OrderSimple } from "../types";

async function _findAll(): Promise<OrderSimple[]> {
  await new Promise((r) => setTimeout(r, 220));
  return data.all().map((o) => ({
    id: o.id,
    productName: o.productName,
    thumbnail: o.thumbnail,
    quantity: o.quantity,
    totalPrice: o.totalPrice,
    status: o.status,
    statusLabel: o.statusLabel,
    orderedAt: o.orderedAt,
    pickupLabel: o.pickupLabel,
    reviewWritten: o.reviewWritten,
  }));
}

export const findAll = createAction(_findAll);
