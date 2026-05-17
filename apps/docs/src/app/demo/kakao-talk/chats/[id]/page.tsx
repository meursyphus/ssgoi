import { chat } from "@/demo/kakao-talk/api/chat";
import ChatDetailPage from "@/demo/kakao-talk/page/chat-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await chat.findThread(id);
  return <ChatDetailPage initialData={data} />;
}
