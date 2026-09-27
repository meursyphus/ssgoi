import { photo } from "@/demo/google-photos/api/photo";
import PhotosPage from "@/demo/google-photos/page/photos";

export default async function Page() {
  // Server-rendered first page so the grid (the hero's exit keys) exists on
  // the first render, e.g. Back from a photo that was opened directly.
  const { items } = await photo.findAll();
  return <PhotosPage initialPhotos={items} />;
}
