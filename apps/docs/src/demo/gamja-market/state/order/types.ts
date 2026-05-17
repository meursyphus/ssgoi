import type { Query } from "comwit";
import type {
  OrderSimple,
  OrderDetail,
  CreateOrderInput,
} from "@/demo/gamja-market/api/order";

export type OrderState = {
  orders: Query<OrderSimple[], void>;
  currentOrder: OrderDetail | null;
};

export type OrderActions = {
  init(detail: OrderDetail): void;
  loadOrders(): Promise<void>;
  loadCurrent(id: string): Promise<void>;
  create(input: CreateOrderInput): Promise<OrderDetail>;
  refresh(): Promise<void>;
};

export type { OrderSimple, OrderDetail, CreateOrderInput };
