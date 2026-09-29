import { chat } from "@/demo/kakao-talk/api/chat";
import ChatDrawerPage from "@/demo/kakao-talk/page/chat-drawer";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await chat.findDrawer(id);
  return <ChatDrawerPage initialData={data} />;
}
