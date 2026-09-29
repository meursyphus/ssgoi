export const BASE = "/demo/gamja-market";

export const routes = {
  home: BASE,
  orders: `${BASE}/orders`,
  order: (id: string) => `${BASE}/orders/${id}`,
  product: (id: string) => `${BASE}/products/${id}`,
  photos: (id: string) => `${BASE}/products/${id}/photos`,
  review: (orderId: string) => `${BASE}/review/${orderId}`,
};
