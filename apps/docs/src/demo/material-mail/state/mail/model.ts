import { model, query, keepPreviousData } from "comwit";
import { mail as mailAPI } from "@/demo/material-mail/api/mail";
import type { MailState } from "./types";

export const mail = model<MailState>({
  mails: query<MailState["mails"]["data"], MailState["mailbox"]>({
    initialData: [],
    queryFn: (box) => mailAPI.findAll({ box }),
    placeholderData: keepPreviousData,
  }),
  mailbox: "primary",
  mailboxes: query<MailState["mailboxes"]["data"], void>({
    initialData: { categories: [], labels: [] },
    queryFn: () => mailAPI.findMailboxes(),
    placeholderData: keepPreviousData,
  }),
  current: null,
  searchQuery: "",
  results: query<MailState["results"]["data"], string>({
    initialData: [],
    queryFn: (q) => mailAPI.search(q),
    placeholderData: keepPreviousData,
  }),
  drawerOpen: false,
  accountOpen: false,
});
