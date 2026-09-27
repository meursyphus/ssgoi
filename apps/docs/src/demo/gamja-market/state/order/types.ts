import type { Query } from "comwit";
import type {
  OrderSimple,
  OrderDetail,
  OrderSummary,
  CreateOrderInput,
} from "@/demo/gamja-market/api/order";

export type OrderState = {
  orders: Query<OrderSimple[], void>;
  summary: Query<OrderSummary, void>;
  currentOrder: OrderDetail | null;
  /**
   * Orders placed or changed in this browser session. The server route renders
   * from its own copy of the mock seed, so these win over its `initialData`.
   */
  sessionOrders: Record<string, OrderDetail>;
};

export type OrderActions = {
  init(detail: OrderDetail): void;
  loadOrders(): Promise<void>;
  loadSummary(): Promise<void>;
  loadCurrent(id: string): Promise<void>;
  create(input: CreateOrderInput): Promise<OrderDetail>;
  refresh(): Promise<void>;
};

export type { OrderSimple, OrderDetail, OrderSummary, CreateOrderInput };
