"use client";

import {
  usePhoto,
  type PhotoDetail,
} from "@/demo/airbnb-photo-tour/state/photo";
import { DetailHeader } from "./detail-header";
import { NavArrows } from "./nav-arrows";
import { PhotoCanvas } from "./photo-canvas";
export default function PhotoDetailPage({
  initialData,
}: {
  initialData: PhotoDetail;
}) {
  const photo = usePhoto((state) => ({
    actions: state.actions,
  }));
  photo.actions.initDetail(initialData);
  return (
    <div
      data-ssgoi-transition={`/demo/airbnb-photo-tour/photos/${initialData.id}`}
      className="relative block h-screen bg-white"
    >
      <DetailHeader
        categoryLabel={initialData.categoryLabel}
        indexInCategory={initialData.indexInCategory}
        categoryTotal={initialData.categoryTotal}
      />
      <NavArrows prevId={initialData.prevId} nextId={initialData.nextId} />
      <PhotoCanvas photo={initialData} />
    </div>
  );
}
