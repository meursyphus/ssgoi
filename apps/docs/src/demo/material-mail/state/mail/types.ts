import type { Query } from "comwit";
import type {
  MailSimple,
  MailDetail,
  Mailbox,
  MailboxGroups,
  MailboxId,
  ReplyDraft,
  ReplyMode,
} from "@/demo/material-mail/api/mail";

export type MailState = {
  mails: Query<MailSimple[], MailboxId>;
  /** mailbox picked in the navigation drawer */
  mailbox: MailboxId;
  mailboxes: Query<MailboxGroups, void>;
  /** conversation on the detail screen */
  current: MailDetail | null;
  searchQuery: string;
  results: Query<MailSimple[], string>;
  drawerOpen: boolean;
  accountOpen: boolean;
};

export type MailActions = {
  loadMails(): Promise<void>;
  selectMailbox(box: MailboxId): Promise<void>;
  init(detail: MailDetail): void;
  /** Marks the opened conversation read and re-reads its live state. */
  open(id: string): Promise<void>;
  toggleStar(id: string): Promise<void>;
  archive(id: string): Promise<void>;
  trash(id: string): Promise<void>;
  markUnread(id: string): Promise<void>;
  setSearchQuery(q: string): Promise<void>;
  /** Re-runs the current query (stars / trash may have changed meanwhile). */
  refreshResults(): Promise<void>;
  resetSearch(): void;
  openDrawer(): void;
  closeDrawer(): void;
  openAccount(): void;
  closeAccount(): void;
};

export type {
  MailSimple,
  MailDetail,
  Mailbox,
  MailboxGroups,
  MailboxId,
  ReplyDraft,
  ReplyMode,
};
