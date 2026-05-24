"use client";

import type { PhotoSimple } from "@/demo/google-photos/state/photo";
import { PhotoGridLink } from "@/demo/google-photos/page/shared/photo-grid-link";

/**
 * 3-column square grid. Each cell links to the photo detail, and the <img>
 * carries `data-hero-exit-key` so it plays the source side of the hero pair.
 */
export function PhotoGrid({ photos }: { photos: PhotoSimple[] }) {
  return (
    <div className="grid grid-cols-3 gap-[2px] bg-white">
      {photos.map((p) => (
        <PhotoGridLink key={p.id} photo={p} />
      ))}
    </div>
  );
}
