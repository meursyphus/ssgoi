import type { MailboxId } from "@/demo/material-mail/state/mail";

export const MAILBOX_LABELS: Record<MailboxId, string> = {
  primary: "Primary",
  promotions: "Promotions",
  social: "Social",
  starred: "Starred",
  snoozed: "Snoozed",
  sent: "Sent",
  drafts: "Drafts",
  all: "All mail",
  trash: "Trash",
};
