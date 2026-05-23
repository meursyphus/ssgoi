export interface MailAPI {
  findAll: () => Promise<MailSimple[]>;
}

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
