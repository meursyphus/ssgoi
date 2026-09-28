import { model, query, keepPreviousData } from "comwit";
import { order as orderAPI } from "@/demo/gamja-market/api/order";
import type { OrderState } from "./types";

export const order = model<OrderState>({
  orders: query<OrderState["orders"]["data"], void>({
    initialData: [],
    queryFn: () => orderAPI.findAll(),
    placeholderData: keepPreviousData,
  }),
  summary: query<OrderState["summary"]["data"], void>({
    initialData: {
      totalCount: 0,
      readyCount: 0,
      reviewableOrderId: null,
      reviewableCount: 0,
      recent: [],
    },
    queryFn: () => orderAPI.findSummary(),
    placeholderData: keepPreviousData,
  }),
  currentOrder: null,
  sessionOrders: {},
});
