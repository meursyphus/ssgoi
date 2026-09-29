import { ActionError, createAction } from "@/lib/utils";
import { data, emailOf } from "../data";
import { toDetail } from "../map";
import type { ReplyDraft, ReplyMode } from "../types";

async function _draftReply(id: string, mode: ReplyMode): Promise<ReplyDraft> {
  const found = data.byId(id);
  if (!found) throw new ActionError("Conversation not found");
  const mail = toDetail(found);
  const from = `${mail.fromName} <${mail.fromEmail}>`;
  if (mode === "forward") {
    return {
      id,
      mode,
      to: "",
      subject: `Fwd: ${mail.subject}`,
      quoteHeader: [
        "---------- Forwarded message ---------",
        `From: ${from}`,
        `Date: ${mail.dateLabel}`,
        `Subject: ${mail.subject}`,
      ],
      quote: mail.body,
    };
  }
  const replyTo =
    found.folder === "sent" && found.recipient
      ? emailOf(found.recipient)
      : mail.fromEmail;
  return {
    id,
    mode,
    to: replyTo,
    subject: mail.subject.startsWith("Re:")
      ? mail.subject
      : `Re: ${mail.subject}`,
    quoteHeader: [`On ${mail.dateLabel}, ${from} wrote:`],
    quote: mail.body,
  };
}

export const draftReply = createAction(_draftReply);
