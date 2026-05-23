import { photo } from "@/demo/google-photos/api/photo";
import PhotoDetailPage from "@/demo/google-photos/page/photo-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await photo.find(id);
  return <PhotoDetailPage initialData={data} />;
}
