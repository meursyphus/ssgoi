"use server";

import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { MailSimple } from "../types";

async function _findAll(): Promise<MailSimple[]> {
  await new Promise((r) => setTimeout(r, 220));
  return data.all();
}

export const findAll = createAction(_findAll);
