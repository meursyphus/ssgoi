import { mail } from "@/demo/material-mail/api/mail";
import MailDetailPage from "@/demo/material-mail/page/mail-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await mail.find(id);
  return <MailDetailPage initialData={data} />;
}
