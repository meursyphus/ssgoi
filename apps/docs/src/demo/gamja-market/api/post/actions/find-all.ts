import { createAction } from "@/lib/utils";
import { product } from "@/demo/gamja-market/api/product";
import { data } from "../data";
import type { PostProduct, PostSimple } from "../types";

async function attached(productId: string | null): Promise<PostProduct | null> {
  if (!productId) return null;
  const found = await product.find(productId);
  return {
    id: found.id,
    name: found.name,
    thumbnail: found.thumbnail,
    price: found.price,
  };
}

async function _findAll(): Promise<PostSimple[]> {
  return Promise.all(
    data.all().map(async ({ productId, ...post }) => ({
      ...post,
      product: await attached(productId),
    })),
  );
}

export const findAll = createAction(_findAll);
