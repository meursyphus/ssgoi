export interface MailAPI {
  /** Conversations in one mailbox, newest first. */
  findAll: (filter: FindAllFilter) => Promise<MailSimple[]>;
  /** One conversation for the detail screen. */
  find: (id: string) => Promise<MailDetail>;
  /** Plain-text search over sender, subject and preview (Trash excluded). */
  search: (q: string) => Promise<MailSimple[]>;
  /** Drawer entries with their unread counts. */
  findMailboxes: () => Promise<MailboxGroups>;
  toggleStar: (id: string) => Promise<MailSimple>;
  /** Marks the conversation read and returns its current row state. */
  markRead: (id: string) => Promise<MailSimple>;
  markUnread: (id: string) => Promise<MailSimple>;
  /** Archive / Trash / restore to the original category. */
  move: (id: string, to: MoveTarget) => Promise<MailSimple>;
  /** Prefilled compose fields for Reply / Reply all / Forward. */
  draftReply: (id: string, mode: ReplyMode) => Promise<ReplyDraft>;
}

export type Category = "primary" | "promotions" | "social";

export type MailboxId =
  | Category
  | "starred"
  | "snoozed"
  | "sent"
  | "drafts"
  | "all"
  | "trash";

export type MoveTarget = "archive" | "trash" | "restore";

export type ReplyMode = "reply" | "all" | "forward";

export type FindAllFilter = { box: MailboxId };

export type Mailbox = {
  id: MailboxId;
  label: string;
  /** Unread count; null hides the badge. */
  count: number | null;
};

/** Drawer sections: inbox categories, then "All labels". */
export type MailboxGroups = { categories: Mailbox[]; labels: Mailbox[] };

export type MailSimple = {
  id: string;
  sender: string;
  senderInitial: string;
  /** tailwind background-color class for the avatar circle */
  senderColor: string;
  subject: string;
  preview: string;
  /** pre-formatted timestamp label, e.g. "3 min", "1 h", "Mon", "5/22" */
  timeLabel: string;
  unread: boolean;
  hasAttachment: boolean;
  starred: boolean;
};

export type MailDetail = MailSimple & {
  /** "Inbox", "Promotions", "Sent", … shown as a chip next to the subject */
  label: string;
  fromName: string;
  fromEmail: string;
  /** "me" or the recipient's name for sent mail */
  toLabel: string;
  /** e.g. "May 28, 10:41 AM" */
  dateLabel: string;
  body: string[];
  attachment: { name: string; size: string } | null;
};

export type ReplyDraft = {
  /** conversation being answered — Close / Send fall back to it */
  id: string;
  mode: ReplyMode;
  to: string;
  subject: string;
  /** "On May 28, 10:41 AM, Alice Chen <…> wrote:" or the forward header */
  quoteHeader: string[];
  quote: string[];
};
