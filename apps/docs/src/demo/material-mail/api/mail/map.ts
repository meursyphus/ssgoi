import { ME, emailOf, type SeedMail } from "./data";
import type { MailDetail, MailSimple } from "./types";

const FOLDER_LABEL: Record<SeedMail["folder"], string> = {
  primary: "Inbox",
  promotions: "Promotions",
  social: "Social",
  sent: "Sent",
};

/** List row. Sent mail is shown by recipient, the way Gmail's Sent box is. */
export function toSimple(m: SeedMail): MailSimple {
  return {
    id: m.id,
    sender: m.folder === "sent" ? `To: ${m.recipient}` : m.sender,
    senderInitial: m.senderInitial,
    senderColor: m.senderColor,
    subject: m.subject,
    preview: m.preview,
    timeLabel: m.timeLabel,
    unread: m.unread,
    hasAttachment: !!m.attachment,
    starred: m.starred,
  };
}

export function toDetail(m: SeedMail): MailDetail {
  const sent = m.folder === "sent";
  return {
    ...toSimple(m),
    sender: sent ? ME.name : m.sender,
    senderInitial: sent ? ME.name[0] : m.senderInitial,
    senderColor: sent ? "bg-indigo-500" : m.senderColor,
    label:
      m.location === "trash"
        ? "Trash"
        : m.location === "archive"
          ? ""
          : FOLDER_LABEL[m.folder],
    fromName: sent ? ME.name : m.sender,
    fromEmail: sent ? ME.email : (m.email ?? emailOf(m.sender)),
    toLabel: sent ? (m.recipient ?? "") : "me",
    dateLabel: m.sentAt,
    body: [m.preview, ...m.extra, m.sign],
    attachment: m.attachment ?? null,
  };
}

export function matches(m: SeedMail, q: string) {
  return [m.sender, m.recipient ?? "", m.subject, m.preview, ...m.extra].some(
    (text) => text.toLowerCase().includes(q),
  );
}
