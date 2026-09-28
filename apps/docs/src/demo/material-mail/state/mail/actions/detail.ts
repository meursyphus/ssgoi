import { action, silent } from "comwit";
import { toast } from "sonner";
import { mail as mailAPI } from "@/demo/material-mail/api/mail";
import { mail } from "../model";
import type { MailActions, MailDetail, MailSimple } from "../types";

export const detailActions = action<
  Pick<
    MailActions,
    "init" | "open" | "toggleStar" | "archive" | "trash" | "markUnread"
  >
>(({ state }) => {
  class DetailActions {
    private model = state(mail);

    /**
     * Called during render. The server's initialData does not know about
     * stars toggled in this session, so the row the user tapped wins —
     * otherwise the star would flash empty while the page drills in.
     */
    init(detail: MailDetail) {
      if (this.model.current?.id === detail.id) return;
      const row = [...this.model.mails.data, ...this.model.results.data].find(
        (m) => m.id === detail.id,
      );
      silent(() => {
        this.model.current = row ? { ...detail, starred: row.starred } : detail;
      });
    }

    /** Marks it read and re-reads it, so archive / trash show in its chip. */
    async open(id: string) {
      const row = await mailAPI.markRead(id);
      this.sync(row);
      const fresh = await mailAPI.find(id);
      if (this.model.current?.id === id) this.model.current = fresh;
    }

    async toggleStar(id: string) {
      const row = await mailAPI.toggleStar(id);
      this.sync(row);
    }

    async archive(id: string) {
      await mailAPI.move(id, "archive");
      await this.model.mails.query(this.model.mailbox, { force: true });
      toast("Conversation archived", {
        action: { label: "Undo", onClick: () => void this.restore(id) },
      });
    }

    async trash(id: string) {
      await mailAPI.move(id, "trash");
      await this.model.mails.query(this.model.mailbox, { force: true });
      toast("Conversation moved to Trash", {
        action: { label: "Undo", onClick: () => void this.restore(id) },
      });
    }

    async markUnread(id: string) {
      const row = await mailAPI.markUnread(id);
      this.sync(row);
      toast("Marked as unread");
    }

    private async restore(id: string) {
      await mailAPI.move(id, "restore");
      await this.model.mails.query(this.model.mailbox, { force: true });
    }

    /** Mirror one row's flags into the list, search results and detail. */
    private sync(row: MailSimple) {
      for (const list of [this.model.mails.data, this.model.results.data]) {
        const hit = list.find((m) => m.id === row.id);
        if (hit) {
          hit.starred = row.starred;
          hit.unread = row.unread;
        }
      }
      if (this.model.current?.id === row.id) {
        this.model.current.starred = row.starred;
        this.model.current.unread = row.unread;
      }
    }
  }
  return new DetailActions();
});
