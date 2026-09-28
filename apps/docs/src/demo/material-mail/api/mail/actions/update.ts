import { ActionError, createAction } from "@/lib/utils";
import { data } from "../data";
import { toSimple } from "../map";
import type { MailSimple, MoveTarget } from "../types";

function patch(id: string, next: Parameters<typeof data.update>[1]) {
  const updated = data.update(id, next);
  if (!updated) throw new ActionError("Conversation not found");
  return toSimple(updated);
}

async function _toggleStar(id: string): Promise<MailSimple> {
  const current = data.byId(id);
  if (!current) throw new ActionError("Conversation not found");
  return patch(id, { starred: !current.starred });
}

async function _markRead(id: string): Promise<MailSimple> {
  return patch(id, { unread: false });
}

async function _markUnread(id: string): Promise<MailSimple> {
  return patch(id, { unread: true });
}

async function _move(id: string, to: MoveTarget): Promise<MailSimple> {
  return patch(id, { location: to === "restore" ? "inbox" : to });
}

export const toggleStar = createAction(_toggleStar);
export const markRead = createAction(_markRead);
export const markUnread = createAction(_markUnread);
export const move = createAction(_move);
