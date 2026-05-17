import type { ProductSimple } from "@/demo/gamja-market/api/product";

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CartProductMeta = Pick<
  ProductSimple,
  "id" | "name" | "thumbnail" | "price"
> & {
  pickupDate: string;
  pickupPlace: string;
};

export type CartState = {
  items: CartItem[];
  isCheckingOut: boolean;
};

export type CartActions = {
  add(meta: CartProductMeta): void;
  subtract(productId: string): void;
  clear(): void;
  checkout(metaList: CartProductMeta[]): Promise<void>;
};
