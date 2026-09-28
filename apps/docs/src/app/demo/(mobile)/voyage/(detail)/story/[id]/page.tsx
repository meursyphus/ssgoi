import { story } from "@/demo/voyage/api/story";
import StoryDetailPage from "@/demo/voyage/page/story-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [data, related] = await Promise.all([
    story.find(id),
    story.findRelated(id),
  ]);
  return <StoryDetailPage initialData={data} related={related} />;
}
