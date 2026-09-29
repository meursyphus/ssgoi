import { createAction } from "@/lib/utils";
import { data, type SeedMail } from "../data";
import { toSimple } from "../map";
import type { FindAllFilter, MailboxId, MailSimple } from "../types";

const inBox: Record<MailboxId, (m: SeedMail) => boolean> = {
  primary: (m) => m.folder === "primary" && m.location === "inbox",
  promotions: (m) => m.folder === "promotions" && m.location === "inbox",
  social: (m) => m.folder === "social" && m.location === "inbox",
  starred: (m) => m.starred && m.location !== "trash",
  snoozed: () => false,
  sent: (m) => m.folder === "sent" && m.location !== "trash",
  drafts: () => false,
  all: (m) => m.location !== "trash",
  trash: (m) => m.location === "trash",
};

async function _findAll({ box }: FindAllFilter): Promise<MailSimple[]> {
  return data.all().filter(inBox[box]).map(toSimple);
}

export const findAll = createAction(_findAll);
