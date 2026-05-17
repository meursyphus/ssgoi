import type { Query } from "comwit";
import type {
  ProductSimple,
  ProductDetail,
} from "@/demo/gamja-market/api/product";

export type ProductState = {
  products: Query<ProductSimple[], void>;
  currentProduct: ProductDetail | null;
};

export type ProductActions = {
  init(detail: ProductDetail): void;
  loadProducts(): Promise<void>;
};

export type { ProductSimple, ProductDetail };
