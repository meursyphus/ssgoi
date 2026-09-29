import { chat } from "@/demo/kakao-talk/api/chat";
import PhotoViewerPage from "@/demo/kakao-talk/page/photo-viewer";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; mid: string }>;
}) {
  const { id, mid } = await params;
  const data = await chat.findPhoto(id, mid);
  return <PhotoViewerPage initialData={data} />;
}
