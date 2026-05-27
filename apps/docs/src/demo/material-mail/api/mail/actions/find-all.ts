import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { MailSimple } from "../types";

async function _findAll(): Promise<MailSimple[]> {
  return data.all();
}

export const findAll = createAction(_findAll);
