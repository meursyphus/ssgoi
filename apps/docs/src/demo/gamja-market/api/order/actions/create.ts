"use server";

import { createAction, ActionError } from "@/lib/utils";
import { data, statusToLabel } from "../data";
import type { CreateOrderInput, OrderDetail } from "../types";

async function _create(input: CreateOrderInput): Promise<OrderDetail> {
  await new Promise((r) => setTimeout(r, 320));
  if (input.quantity < 1) throw new ActionError("수량은 1개 이상이어야 합니다");

  const today = new Date();
  const orderedAt = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  const status: OrderDetail["status"] = "ready";
  const next = data.create({
    productId: input.productId,
    productName: input.productName,
    thumbnail: input.thumbnail,
    quantity: input.quantity,
    unitPrice: input.unitPrice,
    totalPrice: input.unitPrice * input.quantity,
    status,
    statusLabel: statusToLabel(status),
    orderedAt,
    pickupLabel: `${input.pickupDate} 픽업예정`,
    pickupDate: input.pickupDate,
    pickupPlace: input.pickupPlace,
    reviewWritten: false,
  });

  return next;
}

export const create = createAction(_create);
