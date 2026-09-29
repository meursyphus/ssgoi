"use client";

import { useEffect } from "react";
import { useMail, type MailDetail } from "@/demo/material-mail/state/mail";
import { DetailHeader } from "./detail-header";
import { SubjectRow } from "./subject-row";
import { SenderRow } from "./sender-row";
import { MessageBody } from "./message-body";
import { ReplyActions } from "./reply-actions";

export default function MailDetailPage({
  initialData,
}: {
  initialData: MailDetail;
}) {
  const mail = useMail((s) => ({ actions: s.actions }));
  mail.actions.init(initialData);

  // Opening a conversation marks it read, so the row is no longer bold when
  // the list comes back.
  useEffect(() => {
    void mail.actions.open(initialData.id);
  }, [mail.actions, initialData.id]);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <DetailHeader id={initialData.id} />
      <SubjectRow mail={initialData} />
      <SenderRow mail={initialData} />
      <MessageBody mail={initialData} />
      <ReplyActions id={initialData.id} />
    </div>
  );
}
