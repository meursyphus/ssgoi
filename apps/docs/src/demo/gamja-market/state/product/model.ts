import { model, query, keepPreviousData } from "comwit";
import { product as productAPI } from "@/demo/gamja-market/api/product";
import type { ProductState } from "./types";

export const product = model<ProductState>({
  products: query<ProductState["products"]["data"], void>({
    initialData: [],
    queryFn: () => productAPI.findAll(),
    placeholderData: keepPreviousData,
  }),
  currentProduct: null,
});
