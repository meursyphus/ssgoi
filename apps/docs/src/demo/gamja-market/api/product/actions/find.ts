import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { ProductDetail } from "../types";

async function _find(id: string): Promise<ProductDetail> {
  const product = data.byId(id);
  if (!product) throw new ActionError("상품을 찾을 수 없습니다");
  return product;
}

export const find = createAction(_find);
