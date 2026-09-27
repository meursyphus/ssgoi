"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePhoto, type PhotoSimple } from "@/demo/google-photos/state/photo";
import { PhotoGrid } from "./photo-grid";
export default function PhotosPage({
  initialPhotos = [],
}: {
  initialPhotos?: PhotoSimple[];
}) {
  const photo = usePhoto((state) => ({
    photos: state.photos,
    actions: state.actions,
  }));
  useEffect(() => {
    photo.actions.loadAll();
  }, [photo.actions]);
  const items =
    photo.photos.data.items.length > 0
      ? photo.photos.data.items
      : initialPhotos;
  return (
    <div className="block min-h-full flex-1 bg-white">
      {photo.photos.isLoading && items.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-neutral-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <PhotoGrid photos={items} />
      )}
    </div>
  );
}
