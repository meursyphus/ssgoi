import { resolveActions } from "@/lib/utils";

export * from "./types";

import { findAll } from "./actions/find-all";
import { find } from "./actions/find";
import { search } from "./actions/search";
import { findMailboxes } from "./actions/find-mailboxes";
import { toggleStar, markRead, markUnread, move } from "./actions/update";
import { draftReply } from "./actions/draft-reply";

export const mail = resolveActions({
  findAll,
  find,
  search,
  findMailboxes,
  toggleStar,
  markRead,
  markUnread,
  move,
  draftReply,
});
