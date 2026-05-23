"use client";

import { useEffect } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { Loader2 } from "lucide-react";
import { usePhoto } from "@/demo/google-photos/state/photo";
import { PhotoGrid } from "./photo-grid";

export default function PhotosPage() {
  const photo = usePhoto((state) => ({
    photos: state.photos,
    actions: state.actions,
  }));

  useEffect(() => {
    photo.actions.loadAll();
  }, [photo.actions]);

  return (
    <SsgoiTransition
      id="/demo/google-photos"
      className="block min-h-full bg-white"
    >
      {photo.photos.isLoading && photo.photos.data.items.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-neutral-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <PhotoGrid photos={photo.photos.data.items} />
      )}
    </SsgoiTransition>
  );
}
