import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { Category, MailboxGroups } from "../types";

async function _findMailboxes(): Promise<MailboxGroups> {
  const mails = data.all();
  const unread = (folder: Category) =>
    mails.filter(
      (m) => m.folder === folder && m.location === "inbox" && m.unread,
    ).length || null;
  return {
    categories: [
      { id: "primary", label: "Primary", count: unread("primary") },
      { id: "promotions", label: "Promotions", count: unread("promotions") },
      { id: "social", label: "Social", count: unread("social") },
    ],
    labels: [
      { id: "starred", label: "Starred", count: null },
      { id: "snoozed", label: "Snoozed", count: null },
      { id: "sent", label: "Sent", count: null },
      { id: "drafts", label: "Drafts", count: null },
      { id: "all", label: "All mail", count: null },
      { id: "trash", label: "Trash", count: null },
    ],
  };
}

export const findMailboxes = createAction(_findMailboxes);
