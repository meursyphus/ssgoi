"use client";

import { usePhoto, type PhotoDetail } from "@/demo/google-photos/state/photo";
import { PhotoCanvas } from "./photo-canvas";
import { BackButton } from "./back-button";
import { PhotoMeta } from "./photo-meta";
export default function PhotoDetailPage({
  initialData,
}: {
  initialData: PhotoDetail;
}) {
  const photo = usePhoto((state) => ({
    actions: state.actions,
  }));
  photo.actions.init(initialData);
  return (
    <div
      data-ssgoi-transition={`/demo/google-photos/p/${initialData.id}`}
      className="relative block h-full bg-white"
    >
      <BackButton />
      <PhotoCanvas photo={initialData} />
      <PhotoMeta photo={initialData} />
    </div>
  );
}
