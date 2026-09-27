import { post as postAPI } from "@/demo/instagram/api/post";
import ReelViewerPage from "@/demo/instagram/page/reel-viewer";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialData = await postAPI.findReel(id);
  return <ReelViewerPage initialData={initialData} />;
}
