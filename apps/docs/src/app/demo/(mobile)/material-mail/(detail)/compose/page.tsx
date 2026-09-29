import { mail, type ReplyMode } from "@/demo/material-mail/api/mail";
import ComposePage from "@/demo/material-mail/page/compose";

const MODES: ReplyMode[] = ["reply", "all", "forward"];

// Reply / Reply all / Forward reuse this screen: /compose?reply=<id>&mode=…
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    reply?: string | string[];
    mode?: string | string[];
  }>;
}) {
  const { reply, mode } = await searchParams;
  const replyMode = MODES.find((m) => m === mode) ?? "reply";
  const draft =
    typeof reply === "string" ? await mail.draftReply(reply, replyMode) : null;
  return <ComposePage draft={draft} />;
}
