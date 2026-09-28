import { action } from "comwit";
import { mail } from "../model";
import type { MailActions } from "../types";

export const uiActions = action<
  Pick<
    MailActions,
    "openDrawer" | "closeDrawer" | "openAccount" | "closeAccount"
  >
>(({ state }) => {
  class UiActions {
    private model = state(mail);
    openDrawer() {
      this.model.accountOpen = false;
      this.model.drawerOpen = true;
      void this.model.mailboxes.query({ force: true });
    }
    closeDrawer() {
      this.model.drawerOpen = false;
    }
    openAccount() {
      this.model.drawerOpen = false;
      this.model.accountOpen = true;
    }
    closeAccount() {
      this.model.accountOpen = false;
    }
  }
  return new UiActions();
});
