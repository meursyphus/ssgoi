import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { PostSimple } from "../types";

async function _findAll(): Promise<PostSimple[]> {
  return data.all().map(({ id, image, kind }) => ({ id, image, kind }));
}

export const findAll = createAction(_findAll);
