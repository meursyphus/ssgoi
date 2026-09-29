export type OrderStatus = "pending" | "ready" | "picked_up";

export interface OrderAPI {
  findAll: () => Promise<OrderSimple[]>;
  find: (id: string) => Promise<OrderDetail>;
  create: (input: CreateOrderInput) => Promise<OrderDetail>;
  markReviewWritten: (id: string) => Promise<void>;
  /** 나의당근 hub: counts, the next order to review and the newest orders. */
  findSummary: () => Promise<OrderSummary>;
}

export type CreateOrderInput = {
  productId: string;
  productName: string;
  thumbnail: string;
  unitPrice: number;
  pickupDate: string;
  pickupPlace: string;
  quantity: number;
};

export type OrderSimple = {
  id: string;
  productName: string;
  thumbnail: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  statusLabel: string;
  orderedAt: string;
  pickupLabel: string;
  reviewWritten: boolean;
};

export type OrderDetail = OrderSimple & {
  productId: string;
  unitPrice: number;
  pickupPlace: string;
  pickupDate: string;
};

export type OrderSummary = {
  totalCount: number;
  readyCount: number;
  /** Oldest picked-up order still waiting for a review, or null. */
  reviewableOrderId: string | null;
  reviewableCount: number;
  /** Newest orders, for the 나의당근 preview. */
  recent: OrderSimple[];
};
