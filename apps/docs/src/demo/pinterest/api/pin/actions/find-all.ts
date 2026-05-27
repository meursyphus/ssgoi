import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { PinSimple } from "../types";

async function _findAll(): Promise<PinSimple[]> {
  return data.all().map(({ description, tags, domain, ...rest }) => {
    void description;
    void tags;
    void domain;
    return rest;
  });
}

export const findAll = createAction(_findAll);
