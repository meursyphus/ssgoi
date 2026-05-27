import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { ProductSimple } from "../types";

async function _findAll(): Promise<ProductSimple[]> {
  return data.all().map(({ description, images, ...rest }) => {
    void description;
    void images;
    return rest;
  });
}

export const findAll = createAction(_findAll);
