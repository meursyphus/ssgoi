import { photo } from "@/demo/airbnb-photo-tour/api/photo";
import GalleryPage from "@/demo/airbnb-photo-tour/page/gallery";

export default async function Page() {
  const data = await photo.getTour();
  return <GalleryPage initialData={data} />;
}
