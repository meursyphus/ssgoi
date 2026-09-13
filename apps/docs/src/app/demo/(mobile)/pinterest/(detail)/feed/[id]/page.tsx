import { pin } from "@/demo/pinterest/api/pin";
import FeedDetailPage from "@/demo/pinterest/page/feed-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [data, allPins] = await Promise.all([pin.find(id), pin.findAll()]);
  const relatedPins = allPins
    .filter((item) => item.id !== id)
    .sort(
      (a, b) =>
        Number(b.category === data.category) -
        Number(a.category === data.category),
    )
    .slice(0, 8);
  return <FeedDetailPage initialData={data} relatedPins={relatedPins} />;
}
