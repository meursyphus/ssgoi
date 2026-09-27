import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { ShareSheet } from "../types";

async function _findShare(id: string): Promise<ShareSheet> {
  const found = data.byId(id);
  if (!found) throw new ActionError("핀을 찾을 수 없습니다");
  const { description, tags, domain, ...pin } = found;
  void description;
  void tags;
  void domain;
  return { pin, contacts: data.contacts() };
}

export const findShare = createAction(_findShare);
