import { model, query, keepPreviousData } from "comwit";
import { order as orderAPI } from "@/demo/gamja-market/api/order";
import type { OrderState } from "./types";

export const order = model<OrderState>({
  orders: query<OrderState["orders"]["data"], void>({
    initialData: [],
    queryFn: () => orderAPI.findAll(),
    placeholderData: keepPreviousData,
  }),
  currentOrder: null,
});
