import { createAction } from "@/lib/utils";
import { data } from "../data";
import { matches, toSimple } from "../map";
import type { MailSimple } from "../types";

async function _search(q: string): Promise<MailSimple[]> {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return data
    .all()
    .filter((m) => m.location !== "trash" && matches(m, needle))
    .map(toSimple);
}

export const search = createAction(_search);
