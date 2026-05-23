import { model, query, keepPreviousData } from "comwit";
import { mail as mailAPI } from "@/demo/material-mail/api/mail";
import type { MailState } from "./types";

export const mail = model<MailState>({
  mails: query<MailState["mails"]["data"], void>({
    initialData: [],
    queryFn: () => mailAPI.findAll(),
    placeholderData: keepPreviousData,
  }),
});
