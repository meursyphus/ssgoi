import { ActionError, createAction } from "@/lib/utils";
import { data } from "../data";
import { toDetail } from "../map";
import type { MailDetail } from "../types";

async function _find(id: string): Promise<MailDetail> {
  const found = data.byId(id);
  if (!found) throw new ActionError("Conversation not found");
  return toDetail(found);
}

export const find = createAction(_find);
