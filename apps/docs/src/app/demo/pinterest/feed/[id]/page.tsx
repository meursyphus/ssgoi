import { pin } from "@/demo/pinterest/api/pin";
import FeedDetailPage from "@/demo/pinterest/page/feed-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await pin.find(id);
  return <FeedDetailPage initialData={data} />;
}
