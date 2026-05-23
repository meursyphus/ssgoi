import { action } from "comwit";
import { mail } from "../model";
import type { MailActions } from "../types";

export const loadActions = action<Pick<MailActions, "loadMails">>(
  ({ state }) => {
    class LoadActions {
      private model = state(mail);
      async loadMails() {
        await this.model.mails.query();
      }
    }
    return new LoadActions();
  },
);
