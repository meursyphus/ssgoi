import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { PinSimple } from "../types";

async function _search(query: string): Promise<PinSimple[]> {
  return data.search(query).map(({ description, tags, domain, ...rest }) => {
    void description;
    void tags;
    void domain;
    return rest;
  });
}

export const search = createAction(_search);
