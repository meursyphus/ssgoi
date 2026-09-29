import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { FindAllFilter, PinSimple } from "../types";

async function _findAll(filter: FindAllFilter = {}): Promise<PinSimple[]> {
  const pins = filter.board ? data.byBoard(filter.board) : data.all();
  return pins.map(({ description, tags, domain, ...rest }) => {
    void description;
    void tags;
    void domain;
    return rest;
  });
}

export const findAll = createAction(_findAll);
