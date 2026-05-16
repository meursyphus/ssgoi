import { post as postAPI } from "@/demo/instagram/api/post";
import FeedDetailPage from "@/demo/instagram/page/feed-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialData = await postAPI.find(id);
  return <FeedDetailPage initialData={initialData} />;
}
