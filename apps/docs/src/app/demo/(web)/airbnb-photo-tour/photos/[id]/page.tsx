import { photo } from "@/demo/airbnb-photo-tour/api/photo";
import PhotoDetailPage from "@/demo/airbnb-photo-tour/page/photo-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await photo.find(id);
  return <PhotoDetailPage initialData={data} />;
}
