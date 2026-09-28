import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { PinSimple } from "../types";

async function _findSaved(): Promise<PinSimple[]> {
  return data.saved().map(({ description, tags, domain, ...rest }) => {
    void description;
    void tags;
    void domain;
    return rest;
  });
}

export const findSaved = createAction(_findSaved);
