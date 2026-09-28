import { action } from "comwit";
import { mail } from "../model";
import type { MailActions, MailboxId } from "../types";

// Every list read is forced: cached entries are snapshots taken at fetch time,
// so restoring one would drop stars / read state changed since then.
export const loadActions = action<
  Pick<MailActions, "loadMails" | "selectMailbox">
>(({ state }) => {
  class LoadActions {
    private model = state(mail);
    async loadMails() {
      await this.model.mails.query(this.model.mailbox, { force: true });
    }
    async selectMailbox(box: MailboxId) {
      this.model.mailbox = box;
      this.model.drawerOpen = false;
      await this.model.mails.query(box, { force: true });
    }
  }
  return new LoadActions();
});
