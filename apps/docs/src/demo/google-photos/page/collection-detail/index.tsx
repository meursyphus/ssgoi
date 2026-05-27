"use client";

import {
  useCollection,
  type CollectionDetail,
} from "@/demo/google-photos/state/collection";
import { CollectionHeader } from "./collection-header";
import { CollectionPhotoGrid } from "./collection-photo-grid";
export default function CollectionDetailPage({
  initialData,
}: {
  initialData: CollectionDetail;
}) {
  const collection = useCollection((state) => ({
    actions: state.actions,
  }));
  collection.actions.init(initialData);
  return (
    <div
      data-ssgoi-transition={`/demo/google-photos/c/${initialData.id}`}
      className="block min-h-full bg-white"
    >
      <CollectionHeader collection={initialData} />
      <CollectionPhotoGrid photos={initialData.photos} />
    </div>
  );
}
