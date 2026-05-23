import type { Query } from "comwit";
import type { MailSimple } from "@/demo/material-mail/api/mail";

export type MailState = {
  mails: Query<MailSimple[], void>;
};

export type MailActions = {
  loadMails(): Promise<void>;
};

export type { MailSimple };
