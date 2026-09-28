import { create } from "comwit";
import { mail } from "./model";
import { loadActions } from "./actions/load";
import { detailActions } from "./actions/detail";
import { searchActions } from "./actions/search";
import { uiActions } from "./actions/ui";
import type { MailState, MailActions } from "./types";

export * from "./types";

export const useMail = create<MailState, MailActions>(mail, {
  actions: [loadActions, detailActions, searchActions, uiActions],
});
