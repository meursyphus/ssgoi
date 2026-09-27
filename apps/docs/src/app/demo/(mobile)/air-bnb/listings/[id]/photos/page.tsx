import { listing } from "@/demo/air-bnb/api/listing";
import PhotoTourPage from "@/demo/air-bnb/page/photo-tour";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await listing.find(id);
  return <PhotoTourPage initialData={data} />;
}
