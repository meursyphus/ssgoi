import { create } from "comwit";
import { mail } from "./model";
import { loadActions } from "./actions/load";
import type { MailState, MailActions } from "./types";

export * from "./types";

export const useMail = create<MailState, MailActions>(mail, {
  actions: [loadActions],
});
