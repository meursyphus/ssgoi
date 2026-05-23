import { collection } from "@/demo/google-photos/api/collection";
import CollectionDetailPage from "@/demo/google-photos/page/collection-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await collection.find(id);
  return <CollectionDetailPage initialData={data} />;
}
