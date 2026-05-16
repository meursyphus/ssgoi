"use server";

import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { ProductSimple } from "../types";

async function _findAll(): Promise<ProductSimple[]> {
  await new Promise((r) => setTimeout(r, 220));
  return data.all().map(({ description, images, ...rest }) => {
    void description;
    void images;
    return rest;
  });
}

export const findAll = createAction(_findAll);
